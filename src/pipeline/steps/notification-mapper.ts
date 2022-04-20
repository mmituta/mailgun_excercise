import { DomainEvent } from "mailgun.js/interfaces/Events";
import { MailgunMessage } from "../../mailgun-message";
import { Notification } from "../../notification/notification";

/**
 * Is responsible for mapping between {@link MailgunMessage} and {@link Notification} class.
 */
export class NotificationMapper {
    constructor(private eventMapper: NotificationEventMapper = new NotificationEventMapper()){
    }

    public map(message: MailgunMessage): Notification {       
        return new Notification('Mailgun', message.event.timestamp, this.eventMapper.map(message.event));
    }
}

export class NotificationEventMapper{
    public map(eventFromMessage: DomainEvent): string{
        return`email ${eventFromMessage.event}`;
    }
}