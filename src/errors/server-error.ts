export class ServerError extends Error{
    constructor(message = 'Server error'){
        super(message);
    }
}