import {VerifyWebhookStep} from './verify-webhook-step';
import {RequestVerifier} from '../../verification/request-verifier';
import { VerificationError } from '../../verification/verification-error';
import { MailgunMessage } from '../../mailgun-message';
describe('Tests for the VerifyWebhookStep class', () => {

    it('Should throw error if message does not come from Mailgun', () => {
        const step: VerifyWebhookStep = new VerifyWebhookStep( comesFromMailgun(false));
        expect(()=>step.process(new MailgunMessage(null, null))).toThrow(new VerificationError())
    });

    it('Should not throw error if message comes from Mailgun ', () => {        
        const step: VerifyWebhookStep = new VerifyWebhookStep( comesFromMailgun(true));
        expect(()=>step.process(new MailgunMessage(null, null))).not.toThrowError();
    });
});

function comesFromMailgun(fromMailgun: boolean) {
    const verifierSpy: jasmine.SpyObj<RequestVerifier> = jasmine.createSpyObj<RequestVerifier>('verifier', ['comesFromMailgun']);
    verifierSpy.comesFromMailgun.and.returnValue(fromMailgun);
    return verifierSpy;
}
