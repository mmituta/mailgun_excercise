import { ServerError } from "../errors/server-error";

export class NotificationError extends ServerError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotificationError.prototype)

    }

}