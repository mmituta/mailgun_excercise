

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDbWebhookArchive } from "./archive/dynamo-webhook-archive";
import { MailgunMessage } from "./mailgun-message";
import { MailgunTokenVerifier } from "./verification/mailgun-token-verifier";
import { SNSPublisher } from "./notification/sns-publisher";
import { PublishNotificationStep } from "./pipeline/steps/publish-notification-step";
import { WebhookProcessingPipeline } from "./pipeline/webhook-pipeline";
import { ArchiveWebhookStep } from "./pipeline/steps/archive-webhook-step";
import { VerifyWebhookStep } from "./pipeline/steps/verify-webhook-step";
import { VerificationError } from "./verification/verification-error";
import { NotificationError } from "./notification/notification-error";
import { ArchiveError } from "./archive/archive-error";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const message: MailgunMessage = MailgunMessage.fromJSON(event.body);

  try {
    await WebhookProcessingPipeline.pipeline().
      withStep(new VerifyWebhookStep(new MailgunTokenVerifier(process.env.MAILGUN_SIGN_KEY))).
      withStep(new ArchiveWebhookStep(new DynamoDbWebhookArchive(process.env.AWS_REGION))).
      withStep(new PublishNotificationStep(new SNSPublisher(process.env.AWS_REGION, process.env.AWS_ACCOUNT_ID))).
      process(message);
  }
  catch (err) {
    console.error(err);
    return errorResponse(err);
  }
  return successResponse();
}

function errorResponse(err: Error): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  if (err instanceof VerificationError) {
    return badRequestResponse(err)
  }
  if (err instanceof NotificationError || err instanceof ArchiveError) {
    return serverErrorResponse(err)
  }
}

function successResponse(): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return newResponse(200, `Web hook successfully processed`);
}

function serverErrorResponse(err: NotificationError | ArchiveError): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return newResponse(500, err.message);
}

function badRequestResponse(err: VerificationError): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return newResponse(400, err.message);
}

function newResponse(code: number, message: string): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return {
    statusCode: code,
    body: message
  };
}