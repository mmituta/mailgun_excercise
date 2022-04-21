import { BadRequestError } from "../errors/bad-request-error";

export class VerificationError extends BadRequestError {

    constructor() {
        super("Request doesn't come from Mailgun");
    }

}