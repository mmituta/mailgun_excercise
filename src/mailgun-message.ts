import { DomainEvent } from "mailgun.js/interfaces/Events"
import { BadRequestError } from "./errors/bad-request-error";
import { VerificationError } from "./verification/verification-error";

export class MailgunMessage {
    constructor(public signature: MailgunSignature, public event: DomainEvent) {

    }

    public toJson(): string {
        const object: any = {};
        object['signature'] = this.signature;
        object['event-data'] = this.event;

        return JSON.stringify(object);
    }

    static fromJSON(json: string): MailgunMessage {
        try {
            const parsedMessage = JSON.parse(json);
            const signature: MailgunSignature = parsedMessage['signature'];
            const event: DomainEvent = parsedMessage['event-data'];

            return new MailgunMessage(signature, event);
        } catch (err) {
            throw new BadRequestError();
        }
    }
}


export class MailgunSignature {
    constructor(public token: string, public timestamp: string, public signature: string) {

    }
}