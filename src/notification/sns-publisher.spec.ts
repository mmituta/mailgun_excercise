import { SNSClient} from "@aws-sdk/client-sns";
import { Notification } from "./notification";
import { NotificationError } from "./notification-error";
import {SNSPublisher} from './sns-publisher';

describe('Tests for the SNSPublisher class', () => {

    it('Should throw notification error if sending failed', async () => {
        const step: jasmine.SpyObj<SNSClient> = jasmine.createSpyObj<SNSClient>('client', ['send']);
        step.send.and.callFake(() => { throw new Error("Sending failed") });

        const publisher: SNSPublisher = new SNSPublisher('region', 'id', step);
        await expectAsync(publisher.publish(new Notification('p', 0, 'type')))
        .toBeRejectedWith(new NotificationError("Sending failed"));
     
    });

    it('Should send the notification', async() => {
        const step: jasmine.SpyObj<SNSClient> = jasmine.createSpyObj('client', ['send']);

        const publisher: SNSPublisher = new SNSPublisher('region', 'id', step);
        await publisher.publish(new Notification('p', 0, 'type'));

        expect(step.send).toHaveBeenCalled();
  
    });
});