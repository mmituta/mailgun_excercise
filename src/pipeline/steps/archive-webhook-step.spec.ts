import {ArchiveWebhookStep} from './archive-webhook-step';
import {WebHookArchive} from '../../archive/webhook-archive'
import { MailgunMessage } from '../../mailgun-message';
import { DomainEvent } from "mailgun.js/interfaces/Events"
import { ArchiveEntry } from '../../archive/archive-entry';

describe('Tests for the ArchiveWebhookStep class', () => {

    it('Should create archive entry based on mailgun message', async () => {
        const archiveSpy: jasmine.SpyObj<WebHookArchive> = jasmine.createSpyObj<WebHookArchive>('archive', ['save']);

        const step: ArchiveWebhookStep = new ArchiveWebhookStep(archiveSpy);
        const message = new MailgunMessage(null, new TestDomainEvent('id', 42));
        await step.process(message);
        expect(archiveSpy.save).toHaveBeenCalledWith(new ArchiveEntry('id', 42, message.toJson()));
    });
});

class TestDomainEvent implements DomainEvent{
    constructor(public id: string, public timestamp: number){        this.timestamp = timestamp;
    }
    severity = 'any';
    tags : string[]
    storage: {
        url: string;
        key: string;
    };
    'delivery-status': {
        tls: false;
        'mx-host': '';
        code: number;
        description: string;
        'session-seconds': number;
        utf8: boolean;
        'attempt-no': number;
        message: string;
        'certificate-verified': boolean;
    };
    'recipient-domain': string;

    campaigns: [];
    reason: string;
    'user-variables': {
        [key: string]: any;
    };
    flags: {
        'is-routed': boolean;
        'is-authenticated': boolean;
        'is-system-test': boolean;
        'is-test-mode': boolean;
    };
    'log-level': string;
    template?: any;
    envelope: {
        transport: string;
        sender: string;
        'sending-ip': string;
        targets: string;
    };
    message: {
        headers: {
            to: string;
            'message-id': string;
            from: string;
            subject: string;
        };
        attachments: [];
        size: 308;
    };
    recipient: string;
    event: string;
}
