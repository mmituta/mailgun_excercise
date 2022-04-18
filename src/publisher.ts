import { Notification } from "./event";

export interface NotificationPublisher {
    publish(event: Notification): void ;
}