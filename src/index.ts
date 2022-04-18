

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

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const message = MailgunMessage.fromJSON(event.body);


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
      return {
        statusCode: 400,
        body: err.message
      }
    }
    if (err instanceof NotificationError) {
      return {
        statusCode: 400,
        body: err.message
      }
    }
  }
  return {
    statusCode: 200,
    body: `Web hook successfully processed`
  };


}