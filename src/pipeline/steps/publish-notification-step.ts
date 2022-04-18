import { Notification } from "../../notification/notification";
import { NotificationPublisher } from "../../notification/notification-publisher";
import { MailgunMessage } from "../../mailgun-message";
import { PipelineStep } from "../pipeline-step";

export class PublishNotificationStep implements PipelineStep{
    constructor(private publisher: NotificationPublisher) {
    }

    public async process(mailgunMessage: MailgunMessage): Promise<void> {
        // TODO introduce different format for different types (e.g. failed + temporary/permanent)
        const eventType = `email ${mailgunMessage.event.event}`;
        await this.publisher.publish(new Notification('Mailgun', mailgunMessage.event.timestamp, eventType));
    }
}