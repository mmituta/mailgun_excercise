

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import { MailgunArchive } from "./mailgun-archive";
import { MailgunRequestVerifier } from "./mailgun/mailgun-verifier";
import { SNSPublisher } from "./sns-publisher";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body);
  const verifier = new MailgunRequestVerifier('signature');
  const archive: MailgunArchive = new MailgunArchive();
  await archive.store(event.body);

  const publisher: SNSPublisher = new SNSPublisher();
  await publisher.publish();

  return {
    statusCode: 200,
    body: `Test`
  };


}