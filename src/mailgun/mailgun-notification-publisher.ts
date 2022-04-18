import { Notification } from "../event";
import { NotificationPublisher } from "../publisher";
import { MailgunMessage } from "./mailgun-message";
import { MailgunPipelineStep } from "./mailgun-pipeline-step";

export class MailgunNotificationPublisher implements MailgunPipelineStep{
    constructor(private publisher: NotificationPublisher) {
    }

    public async process(mailgunMessage: MailgunMessage): Promise<void> {
        await this.publisher.publish(new Notification('Mailgun', mailgunMessage.event.timestamp, mailgunMessage.event.event));
    }
}