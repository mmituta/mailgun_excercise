import { ServerError } from "../errors/server-error";

export class ArchiveError extends ServerError {
    constructor(message: string) {
        super(message);
    }
}