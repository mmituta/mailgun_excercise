import { ArchiveEntry } from "../archive/archive-entry";
import { WebHookArchive } from "../archive/webhook-archive";
import { MailgunMessage } from "../mailgun-message";
import { PipelineStep } from "../pipeline-step";

export class ArchiveWebhookStep implements PipelineStep{
    constructor(private archiver: WebHookArchive){
    }

    async process(message: MailgunMessage): Promise<void> {
        this.archiver.save(new ArchiveEntry(message.event.id, message.event.timestamp, message.toJson()));
    }

}