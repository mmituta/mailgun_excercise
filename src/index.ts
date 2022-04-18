

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import { DynamoDbWebhookArchive } from "./dynamo-webhook-archive";
import { MailgunMessage } from "./mailgun/mailgun-message";
import { MailgunRequestVerifier } from "./mailgun/mailgun-verifier";
import { SNSPublisher } from "./sns-publisher";
import { MailgunNotificationPublisher } from "./mailgun/mailgun-notification-publisher";
import { MailgunProcessingPipeline } from "./mailgun-webhook-pipeline";
import { MailgunArchiveStep } from "./mailgun/mailgun-archive-step";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const message = MailgunMessage.fromJSON(event.body);

  const verifier = new MailgunRequestVerifier(process.env.MAILGUN_SIGN_KEY);
  if( !verifier.comesFromMailgun(message.signature)){
    return {
      statusCode: 400,
      body: `Request didn't come from Mailgun`
    };
  }

  MailgunProcessingPipeline.pipeline().
      withStep(new MailgunArchiveStep( new DynamoDbWebhookArchive())).
      withStep(new MailgunNotificationPublisher(new SNSPublisher())).
      process(message);

  return {
    statusCode: 200,
    body: `Web hook successfully processed`
  };


}