

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import { MailgunArchive } from "./mailgun-archive";
import { SNSPublisher } from "./sns-publisher";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event.body);
  const archive: MailgunArchive = new MailgunArchive();
  await archive.store(event.body);

  const publisher: SNSPublisher = new SNSPublisher();
  await publisher.publish();
  
  return {
    statusCode: 200,
    body: `Test`
  };


}