import { MailgunMessage, MailgunSignature } from '../mailgun-message';
import { PipelineStep } from './pipeline-step';
import { WebhookProcessingPipeline } from './webhook-pipeline';

describe('Tests for the WebhookProcessingPipeline class', () => {

    it('Should process steps in order', async () => {
        const callRecord: string[] = [];

        const firstStep: jasmine.SpyObj<PipelineStep> = createStepMock(() => callRecord.push('first'));
        const secondStep: jasmine.SpyObj<PipelineStep> = createStepMock(() => callRecord.push('second'));
        const thirdStep: jasmine.SpyObj<PipelineStep> = createStepMock(() => callRecord.push('third'));

        await WebhookProcessingPipeline.pipeline().
            withStep(firstStep).
            withStep(secondStep).
            withStep(thirdStep).
            process(new MailgunMessage(null, null));

        expect(callRecord).toEqual(['first', 'second', 'third']);
    });

    it('Should not process any steps after step that threw an exception', async () => {

        const firstStep: jasmine.SpyObj<PipelineStep> = createStepMock(() => { });
        const secondStep: jasmine.SpyObj<PipelineStep> = createStepMock(() => { throw new Error('Stop processing') });
        const thirdStep: jasmine.SpyObj<PipelineStep> = createStepMock(() => { });

        try {
            await WebhookProcessingPipeline.pipeline().
                withStep(firstStep).
                withStep(secondStep).
                withStep(thirdStep).
                process(new MailgunMessage(null, null));
        } catch (e) {
            // do nothing in this test case
        }

        expect(firstStep.process).toHaveBeenCalled();
        expect(secondStep.process).toHaveBeenCalled();

        expect(thirdStep.process).not.toHaveBeenCalled();

    });
});

function createStepMock(action: () => void): jasmine.SpyObj<PipelineStep> {
    const step: jasmine.SpyObj<PipelineStep> = jasmine.createSpyObj<PipelineStep>('step', ['process']);
    step.process.and.callFake(action);

    return step;
}
