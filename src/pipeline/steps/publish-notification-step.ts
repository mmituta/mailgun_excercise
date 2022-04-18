import { Notification } from "../../notification/notification";
import { NotificationPublisher } from "../../notification/notification-publisher";
import { MailgunMessage } from "../../mailgun-message";
import { PipelineStep } from "../pipeline-step";

export class PublishNotificationStep implements PipelineStep{
    constructor(private publisher: NotificationPublisher) {
    }

    public async process(mailgunMessage: MailgunMessage): Promise<void> {
        await this.publisher.publish(new Notification('Mailgun', mailgunMessage.event.timestamp, mailgunMessage.event.event));
    }
}