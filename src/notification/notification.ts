/**
 * Defines the notification about a received event.
 */
export class Notification {
    constructor(public provider: string, public timestamp: number, public type: string) {
    }
}