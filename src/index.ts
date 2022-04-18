

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import { WebHookArchive } from "./archive";
import { DynamoDbWebhookArchive } from "./dynamo-webhook-archive";
import { MailgunMessage } from "./mailgun/mailgun-message";
import { MailgunRequestVerifier } from "./mailgun/mailgun-verifier";
import { SNSPublisher } from "./sns-publisher";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const message = MailgunMessage.fromJSON(event.body);

  const verifier = new MailgunRequestVerifier('signature');
  if( !verifier.comesFromMailgun(message.signature)){
    return {
      statusCode: 400,
      body: `Request didn't come from Mailgun`
    };
  }
  const archive: WebHookArchive = new DynamoDbWebhookArchive();
  await archive.save(message);

  const publisher: SNSPublisher = new SNSPublisher();
  await publisher.publish();

  return {
    statusCode: 200,
    body: `Test`
  };


}