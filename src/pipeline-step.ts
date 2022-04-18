import { MailgunMessage } from "./mailgun-message";

export interface PipelineStep{
    process(message: MailgunMessage): void;
}