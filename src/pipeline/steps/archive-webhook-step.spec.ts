import {ArchiveWebhookStep} from './archive-webhook-step';
import {WebHookArchive} from '../../archive/webhook-archive'
import { MailgunMessage } from '../../mailgun-message';
import { DomainEvent } from "mailgun.js/interfaces/Events"
import { ArchiveEntry } from '../../archive/archive-entry';

describe('Tests for the ArchiveWebhookStep class', () => {

    it('Should create archive entry based on mailgun message', async () => {
        const archiveSpy: jasmine.SpyObj<WebHookArchive> = jasmine.createSpyObj<WebHookArchive>('archive', ['save']);

        const step: ArchiveWebhookStep = new ArchiveWebhookStep(archiveSpy);
        const event = <DomainEvent>{
            id : 'id',
            timestamp: 42
        };

        const message = new MailgunMessage(null, event);
        await step.process(message);
        expect(archiveSpy.save).toHaveBeenCalledWith(new ArchiveEntry('id', 42, message.toJson()));
    });
});