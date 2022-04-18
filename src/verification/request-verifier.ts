import { MailgunSignature } from "../mailgun-message";

export interface RequestVerifier{
    comesFromMailgun(message: MailgunSignature): boolean;
}