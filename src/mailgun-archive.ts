import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DomainEvent } from "mailgun.js/interfaces/Events";

export class MailgunArchive{
    public async store(rawMessage: string): Promise<void>{
        const message = JSON.parse(rawMessage);
        const mMessage:DomainEvent = message['event-data'];
        const dbClient = new DynamoDBClient({ region: process.env.AWS_REGION});
        const ddbDocClient = DynamoDBDocumentClient.from(dbClient);
    
      
        const params = {
          TableName: "MailgunEvents",
          Item: {
            id: mMessage.id,
            timestamp: mMessage.timestamp,
            raw: rawMessage
          },
        };
        try {
          const data = await ddbDocClient.send(new PutCommand(params));
          console.log("Success - item added or updated", data);
        } catch (err) {
          console.log("Error", err.stack);
        }
    }
}

