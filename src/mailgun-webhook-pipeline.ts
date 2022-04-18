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

    process(message: MailgunMessage) {
        this.steps.forEach(s=>s.process(message));
    }

}