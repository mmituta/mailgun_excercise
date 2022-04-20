import { DomainEvent } from "mailgun.js/interfaces/Events";

export class NotificationEventTypeMapper {
    private strategies: Map<EventType, EventTypeMappingStrategy> = new Map();

    constructor(private defaultStrategy: EventTypeMappingStrategy = (event:DomainEvent)=> `email ${event.event}`){
        this.strategies.set(EventType.failed, (event: DomainEvent)=>`${event.severity} failure`);
        this.strategies.set(EventType.complained, ()=>`spam complaint reported`);
        this.strategies.set(EventType.unsubscribed, ()=>`user unsubscribed`);

    }

    public map(eventFromMessage: DomainEvent): string {
        const type:EventType= this.eventType(eventFromMessage);
        if(this.strategies.has(type)){
            return this.strategies.get(type)(eventFromMessage);
        }
        return this.defaultStrategy(eventFromMessage);
    }


    private eventType(value: DomainEvent): EventType{
        return EventType[value.event as keyof typeof EventType]
    }
}


type EventTypeMappingStrategy =  (event: DomainEvent) => string;

enum EventType {
    clicked,
    opened,
    delivered,
    failed,
    complained,
    unsubscribed
  }