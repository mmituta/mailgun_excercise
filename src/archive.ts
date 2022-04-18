import { MailgunMessage } from "./mailgun/mailgun-message";

export interface WebHookArchive{
    save(message: MailgunMessage): void;
}