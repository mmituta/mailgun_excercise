import { DynamoDbWebhookArchive } from './dynamo-webhook-archive';
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ArchiveError } from './archive-error';
import { ArchiveEntry } from './archive-entry';

describe('Tests for the DynamoDbWebhookArchive class', () => {

    it('Should throw archive error if save operation failed', async () => {
        const dbClientSpy: jasmine.SpyObj<DynamoDBDocumentClient> = jasmine.createSpyObj<DynamoDBDocumentClient>('db', ['send']);
        dbClientSpy.send.and.throwError('DB Error');

        const webhookArchive: DynamoDbWebhookArchive = new DynamoDbWebhookArchive('region', dbClientSpy);
        await expectAsync(webhookArchive.save(anyEntry())).toBeRejectedWith(new ArchiveError('DB Error'));
    });

    it('Should save archive entry', async () => {
        const dbClientSpy: jasmine.SpyObj<any> = jasmine.createSpyObj<DynamoDBDocumentClient>('db', ['send']);
        const webhookArchive: DynamoDbWebhookArchive = new DynamoDbWebhookArchive('region', dbClientSpy);

        await webhookArchive.save(anyEntry());
        expect(dbClientSpy.send).toHaveBeenCalled();
    });
});

function anyEntry(): ArchiveEntry {
    return new ArchiveEntry('id', 23, 'body');
}
