import { MailgunMessage } from "../../mailgun-message";
import { NotificationEventMapper, NotificationMapper } from "./notification-mapper";
import { DomainEvent } from "mailgun.js/interfaces/Events"
import { Notification } from '../../notification/notification';


describe('Tests for the notification mapper class', () => {

    it('Should map "Mailgun" as provider', () => {
        const event: DomainEvent = <DomainEvent>{};

        const mapper: NotificationMapper = new NotificationMapper();
        const result: Notification = mapper.map(new MailgunMessage(null, event));
        expect(result.provider).toEqual('Mailgun');
    });

    it('Should map timestamp', () => {
        const event: DomainEvent = <DomainEvent>{};
        event.timestamp = 2022;

        const mapper: NotificationMapper = new NotificationMapper();
        const result: Notification = mapper.map(new MailgunMessage(null, event));
        expect(result.timestamp).toEqual(2022);
    });

    it('Should map event using provided event type mapper', ()=>{
        const event: DomainEvent = <DomainEvent>{};
        event.event = 'event';

        const typeMapper:jasmine.SpyObj<NotificationEventMapper> = jasmine.createSpyObj<NotificationEventMapper>('mapper', ['map']);
        typeMapper.map.and.returnValue('mapped type');

        const mapper: NotificationMapper = new NotificationMapper(typeMapper);
        const result: Notification = mapper.map(new MailgunMessage(null, event));
        expect(result.type).toEqual('mapped type');
    });
});