import { Notification } from "../../notification/notification";
import { NotificationPublisher } from "../../notification/notification-publisher";
import { MailgunMessage } from "../../mailgun-message";
import { PipelineStep } from "../pipeline-step";
import { NotificationMapper } from "../../notification/mapper/notification-mapper";

/**
 * This step is responsible for publishing notification about the received mailgun messages.
 */
export class PublishNotificationStep implements PipelineStep{
    constructor(private publisher: NotificationPublisher, private mapper: NotificationMapper = new NotificationMapper()) {
    }

    public async process(mailgunMessage: MailgunMessage): Promise<void> {
        await this.publisher.publish(this.mapper.map(mailgunMessage));
    }
}