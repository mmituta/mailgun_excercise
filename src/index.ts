

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import { DynamoDbWebhookArchive } from "./archive/dynamo-webhook-archive";
import { MailgunMessage } from "./mailgun-message";
import { MailgunTokenVerifier } from "./verification/mailgun-token-verifier";
import { SNSPublisher } from "./notification/sns-publisher";
import { PublishNotificationStep } from "./steps/publish-notification-step";
import { WebhookProcessingPipeline } from "./webhook-pipeline";
import { ArchiveWebhookStep } from "./steps/archive-webhook-step";
import { VerifyWebhookStep } from "./steps/verify-webhook-step";
import { VerificationError } from "./verification/verification-error";
import { NotificationError } from "./notification/notification-error";
import { ArchiveError } from "./archive/archive-error";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const message: MailgunMessage = MailgunMessage.fromJSON(event.body);

  try {
    await WebhookProcessingPipeline.pipeline().
      withStep(new VerifyWebhookStep(new MailgunTokenVerifier(process.env.MAILGUN_SIGN_KEY))).
      withStep(new ArchiveWebhookStep(new DynamoDbWebhookArchive())).
      withStep(new PublishNotificationStep(new SNSPublisher())).
      process(message);
  }
  catch (err) {
    console.error(err);
    if (err instanceof VerificationError) {
      return newBadRequestResponse(err)
    }
    if (err instanceof NotificationError || err instanceof ArchiveError) {
      return newServerErrorResponse(err)
    }
  }
  return {
    statusCode: 200,
    body: `Web hook successfully processed`
  };


}

function newServerErrorResponse(err: NotificationError | ArchiveError): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return {
    statusCode: 500,
    body: err.message
  };
}

function newBadRequestResponse(err: VerificationError): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return {
    statusCode: 400,
    body: err.message
  };
}
