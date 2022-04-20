import { PublishNotificationStep } from './publish-notification-step';
import { NotificationPublisher } from '../../notification/notification-publisher';
import { MailgunMessage } from '../../mailgun-message';
import { NotificationMapper } from './notification-mapper';
import { Notification } from '../../notification/notification';
describe('Tests for the PublishNotificationStep class', () => {

    it('Should publish mapped notification', async () => {
        const publisherSpy: jasmine.SpyObj<NotificationPublisher> = jasmine.createSpyObj<NotificationPublisher>('publisher', ['publish']);
        const mapperSpy: jasmine.SpyObj<NotificationMapper> = jasmine.createSpyObj<NotificationMapper>('mapper', ['map']);

        const notification = new Notification('name', 1, 'type');
        mapperSpy.map.and.returnValue(notification);

        const step: PublishNotificationStep = new PublishNotificationStep(publisherSpy, mapperSpy);
        await step.process(new MailgunMessage(null, null));

        expect(publisherSpy.publish).toHaveBeenCalledOnceWith(notification);
    });
});