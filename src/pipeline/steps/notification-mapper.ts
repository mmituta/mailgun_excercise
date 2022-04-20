import { MailgunMessage } from "../../mailgun-message";
import { Notification } from "../../notification/notification";

/**
 * Is responsible for mapping between {@link MailgunMessage} and {@link Notification} class.
 */
export class NotificationMapper {
    public map(message: MailgunMessage): Notification {
        // TODO introduce different format for different types (e.g. failed + temporary/permanent)

        const eventType = `email ${message.event.event}`;
        return new Notification('Mailgun', message.event.timestamp, eventType);
    }
}