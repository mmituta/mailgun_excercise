import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { NotificationPublisher } from "./notification-publisher";
import { Notification } from "./notification";
import { NotificationError } from "./notification-error";

export class SNSPublisher implements NotificationPublisher{

    private snsClient: SNSClient;
    private arn: string; 
    
    constructor(){
        this.snsClient = new SNSClient({ region: process.env.AWS_REGION });
        this.arn = `arn:aws:sns:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:mail_events_topic`;
    }

    public async publish(notification: Notification){
        try {
            const data = await this.snsClient.send(this.wrapInPublishCommand(notification));
            console.log("Success - notification send",  data);
          } catch (err) {
            console.error("Error while sending notification: ", err.stack);
            throw new NotificationError(err.message);
          }
    }

    private wrapInPublishCommand(notification: Notification): PublishCommand{
        const params = {
            Message: JSON.stringify(notification),
            TopicArn: this.arn,
          };
          return new PublishCommand(params)
    }
}