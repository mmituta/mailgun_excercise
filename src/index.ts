

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import { MailgunArchive } from "./mailgun-archive";
import { MailgunRequestVerifier } from "./mailgun-verifier";
import { SNSPublisher } from "./sns-publisher";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event.body);
  const verifier = new MailgunRequestVerifier();
  const archive: MailgunArchive = new MailgunArchive();
  await archive.store(event.body);

  const publisher: SNSPublisher = new SNSPublisher();
  await publisher.publish();

  return {
    statusCode: 200,
    body: `Test`
  };


}