import {  NotificationEventTypeMapper } from "./notification-event-type-mapper";
import { DomainEvent } from "mailgun.js/interfaces/Events"

describe('Tests for the notification mapper class', () => {

    it('Should map opened event type', () => {
        const mapper: NotificationEventTypeMapper = new NotificationEventTypeMapper();
        const result: string = mapper.map(eventOfType('opened'));
        expect(result).toEqual('email opened');
    });

    it('Should map devlivered event type', () => {
        const mapper: NotificationEventTypeMapper = new NotificationEventTypeMapper();
        const result: string = mapper.map(eventOfType('delivered'));
        expect(result).toEqual('email delivered');
    });

    it('Should map clicked event type', () => {
        const mapper: NotificationEventTypeMapper = new NotificationEventTypeMapper();
        const result: string = mapper.map(eventOfType('clicked'));
        expect(result).toEqual('email clicked');
    });

    it('Should map spam complained event type', () => {
        const mapper: NotificationEventTypeMapper = new NotificationEventTypeMapper();
        const result: string = mapper.map(eventOfType('complained'));
        expect(result).toEqual('spam complaint reported');
    });

    it('Should map unsubscribed event type', () => {
        const mapper: NotificationEventTypeMapper = new NotificationEventTypeMapper();
        const result: string = mapper.map(eventOfType('unsubscribed'));
        expect(result).toEqual('user unsubscribed');
    });
    
    it('Should map permanent failure event type', () => {
        const mapper: NotificationEventTypeMapper = new NotificationEventTypeMapper();    
        const result: string = mapper.map(eventOfType('failed', 'permanent'));
        expect(result).toEqual('permanent failure');
    });

    it('Should map temporary failure event type', () => {
        const mapper: NotificationEventTypeMapper = new NotificationEventTypeMapper();
        const result: string = mapper.map(eventOfType('failed', 'temporary'));
        expect(result).toEqual('temporary failure');
    });
});

function eventOfType(type: string, severity?: string) {
    const event: DomainEvent = <DomainEvent>{};
    event.event = type;
    if(severity){
        event.severity = severity;
    }
    return event;
}
