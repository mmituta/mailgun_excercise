import { MailgunMessage } from "./mailgun-message";

export interface MailgunPipelineStep{
    process(message: MailgunMessage): void;
}