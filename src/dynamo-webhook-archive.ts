import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { WebHookArchive } from "./archive";
import { MailgunMessage } from "./mailgun/mailgun-message";

export class DynamoDbWebhookArchive implements WebHookArchive {

    private dynamoDbClient: DynamoDBDocumentClient;
    constructor() {

        this.dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION }));

    }
    async save(message: MailgunMessage): Promise<void> {
        try {
            const data = await this.dynamoDbClient.send(this.wrapInPutCommand(message));
            console.log("Success - item added or updated", data);
        } catch (err) {
            console.log("Error", err.stack);
        }
    }


    private wrapInPutCommand(message: MailgunMessage) {
        const params = {
            TableName: "MailgunEvents",
            Item: {
                id: message.event.id,
                timestamp: message.event.timestamp,
                raw: message.toJson()
            },
        };

        return new PutCommand(params);
    }
}