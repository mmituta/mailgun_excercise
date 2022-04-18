import * as crypto from "crypto";


export class MailgunRequestVerifier {
    constructor(private signingKey: string) {

    }
    public verify(timestamp: string, token: string, signature: string): boolean {

        const encodedToken = crypto
            .createHmac('sha256', this.signingKey)
            .update(timestamp.concat(token))
            .digest('hex')

        console.info(encodedToken);
        console.info(signature);

        return (encodedToken === signature)

    }
}