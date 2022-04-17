import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

export class SNSPublisher{
    public async publish(){
        const snsClient = new SNSClient({ region: process.env.AWS_REGION });
        const arn = `arn:aws:sns:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:mail_events_topic`;
        const message = "test";

        const params = {
            Message: message,
            TopicArn: arn,
          };
        try {
            const data = await snsClient.send(new PublishCommand(params));
            console.log("Success.",  data);
            return data;
          } catch (err) {
            console.log("Error", err.stack);
          }
    }
}