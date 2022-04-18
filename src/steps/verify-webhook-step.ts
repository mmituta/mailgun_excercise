import { MailgunMessage } from "../mailgun-message";
import { PipelineStep } from "../pipeline-step";
import { RequestVerifier } from "../verification/request-verifier";
import { VerificationError } from "../verification/verification-error";

export class VerifyWebhookStep implements PipelineStep {

    constructor(private verifier: RequestVerifier) {

    }

    process(message: MailgunMessage): void {
        const valid = this.verifier.comesFromMailgun(message.signature);
        if (!valid) {
            throw new VerificationError("Request doesn't come from Mailgun");
        }
    }

}