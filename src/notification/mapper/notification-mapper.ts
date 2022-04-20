import { MailgunMessage } from "../../mailgun-message";
import { Notification } from "../notification";
import { NotificationEventTypeMapper } from "./notification-event-type-mapper";

/**
 * Is responsible for mapping between {@link MailgunMessage} and {@link Notification} class.
 */
export class NotificationMapper {
    constructor(private eventMapper: NotificationEventTypeMapper = new NotificationEventTypeMapper()){
    }

    public map(message: MailgunMessage): Notification {       
        return new Notification('Mailgun', message.event.timestamp, this.eventMapper.map(message.event));
    }
}

