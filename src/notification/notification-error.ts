export class NotificationError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotificationError.prototype)

    }

}