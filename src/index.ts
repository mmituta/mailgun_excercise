

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import { WebHookArchive } from "./archive";
import { DynamoDbWebhookArchive } from "./dynamo-webhook-archive";
import { MailgunMessage } from "./mailgun/mailgun-message";
import { MailgunRequestVerifier } from "./mailgun/mailgun-verifier";
import { SNSPublisher } from "./sns-publisher";
import { Notification } from "./event";
import { NotificationPublisher } from "./publisher";

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

  const publisher: NotificationPublisher = new SNSPublisher();
  await publisher.publish(new Notification('test', 0, 'test'));

  return {
    statusCode: 200,
    body: `Test`
  };


}