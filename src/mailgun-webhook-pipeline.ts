import { MailgunMessage } from "./mailgun/mailgun-message";
import { MailgunPipelineStep } from "./mailgun/mailgun-pipeline-step";

export class MailgunProcessingPipeline {
    public static pipeline(): PipelineBuilder {
        return new PipelineBuilder();
    }
}

class PipelineBuilder {

    private steps: MailgunPipelineStep[] = [];

    withStep(step: MailgunPipelineStep): PipelineBuilder {
        this.steps.push(step);
        return this;
    }

    async process(message: MailgunMessage) {
        for( const step of this.steps){
            await step.process(message);
        }
    }

}