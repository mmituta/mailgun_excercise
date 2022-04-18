import { WebHookArchive } from "../archive";
import { MailgunMessage } from "./mailgun-message";
import { MailgunPipelineStep } from "./mailgun-pipeline-step";

export class MailgunArchiveStep implements MailgunPipelineStep{
    constructor(private archiver: WebHookArchive){
    }

    async process(message: MailgunMessage): Promise<void> {
        this.archiver.save(message);
    }

}