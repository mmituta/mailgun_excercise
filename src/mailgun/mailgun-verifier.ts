import * as crypto from "crypto";
import { MailgunSignature } from "./mailgun-message";


export class MailgunRequestVerifier {
    constructor(private signingKey: string) {

    }
    public comesFromMailgun(messageSignature : MailgunSignature): boolean {
        const encodedToken = crypto
            .createHmac('sha256', this.signingKey)
            .update(messageSignature.timestamp.concat(messageSignature.token))
            .digest('hex')
        return (encodedToken === messageSignature.signature)

    }
}