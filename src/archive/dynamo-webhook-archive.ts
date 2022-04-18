import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { WebHookArchive } from "./webhook-archive";
import { ArchiveEntry } from "./archive-entry";
import { ArchiveError } from "./archive-error";

export class DynamoDbWebhookArchive implements WebHookArchive {

    private dynamoDbClient: DynamoDBDocumentClient;
    constructor(awsRegion: string) {
        this.dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: awsRegion }));
    }
    async save(message: ArchiveEntry): Promise<void> {
        try {
            const data = await this.dynamoDbClient.send(this.wrapInPutCommand(message));
            console.log("Success - item added or updated", data);
        } catch (err) {
            console.error("Error while archiving item: ", err.stack);
            throw new ArchiveError(err.message);
        }
    }


    private wrapInPutCommand(message: ArchiveEntry) {
        const params = {
            TableName: "MailgunEvents",
            Item: {
                id: message.id,
                timestamp: message.timestamp,
                raw: message.requestBody
            },
        };

        return new PutCommand(params);
    }
}