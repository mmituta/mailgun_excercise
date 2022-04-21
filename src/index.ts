

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDbWebhookArchive } from "./archive/dynamo-webhook-archive";
import { MailgunMessage } from "./mailgun-message";
import { MailgunTokenVerifier } from "./verification/mailgun-token-verifier";
import { SNSPublisher } from "./notification/sns-publisher";
import { PublishNotificationStep } from "./pipeline/steps/publish-notification-step";
import { WebhookProcessingPipeline } from "./pipeline/webhook-pipeline";
import { ArchiveWebhookStep } from "./pipeline/steps/archive-webhook-step";
import { VerifyWebhookStep } from "./pipeline/steps/verify-webhook-step";
import { ResponseFactory } from "./response-factory";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const message: MailgunMessage = MailgunMessage.fromJSON(event.body);
  const responseFactory: ResponseFactory = new ResponseFactory();
  try {
    await WebhookProcessingPipeline.pipeline().
      withStep(new VerifyWebhookStep(new MailgunTokenVerifier(process.env.MAILGUN_SIGN_KEY))).
      withStep(new ArchiveWebhookStep(new DynamoDbWebhookArchive(process.env.AWS_REGION))).
      withStep(new PublishNotificationStep(new SNSPublisher(process.env.AWS_REGION, process.env.AWS_ACCOUNT_ID))).
      process(message);
  }
  catch (err) {
    console.error(err);
    return responseFactory.createErrorResponse(err);
  }
  return responseFactory.createSuccessResponse();

}