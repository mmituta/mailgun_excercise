import { Notification } from "./notification";

export interface NotificationPublisher {
    publish(event: Notification): void ;
}