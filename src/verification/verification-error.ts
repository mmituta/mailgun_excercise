export class VerificationError extends Error {

    constructor() {
        super("Request doesn't come from Mailgun");
    }

}