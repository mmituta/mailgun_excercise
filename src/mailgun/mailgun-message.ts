import { DomainEvent } from "mailgun.js/interfaces/Events"

export class MailgunMessage {
    constructor(public signature: MailgunSignature, public event: DomainEvent) {

    }

    static parseJSON(json: string): MailgunMessage {
        const parsedMessage = JSON.parse(json);
        const signature: MailgunSignature = parsedMessage['signature'];
        const event: DomainEvent = parsedMessage['event-data'];

        return new MailgunMessage(signature, event);
    }
}


export class MailgunSignature {
    constructor(public token: string, public timestamp: string, public signature: string) {

    }
}