import { MailgunMessage } from "../mailgun-message";
import { PipelineStep } from "./pipeline-step";

export class WebhookProcessingPipeline {
    public static pipeline(): PipelineBuilder {
        return new PipelineBuilder();
    }
}

class PipelineBuilder {

    private steps: PipelineStep[] = [];

    withStep(step: PipelineStep): PipelineBuilder {
        this.steps.push(step);
        return this;
    }

    async process(message: MailgunMessage) {
        for( const step of this.steps){
            await step.process(message);
        }
    }

}