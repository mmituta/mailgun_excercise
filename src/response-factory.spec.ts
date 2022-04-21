import { ArchiveError } from './archive/archive-error';
import { NotificationError } from './notification/notification-error';
import {ResponseFactory} from './response-factory';
import { VerificationError } from './verification/verification-error';

describe('Tests for the ResponseFactoy class', ()=>{
    const factory: ResponseFactory = new ResponseFactory();


    it('Should create success response', ()=>{
        const response = factory.createSuccessResponse();
        expect(response.statusCode).toEqual(200);
    });

    it('Should create bad request response for VerificationError', ()=>{
        const error = new VerificationError();
        const response = factory.createErrorResponse(error);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(error.message);
    });

    it('Should create bad request response for VerificationError', ()=>{
        const error = new VerificationError();
        const response = factory.createErrorResponse(error);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(error.message);
    });

    it('Should create server error response for NotificationError', ()=>{
        const error = new NotificationError('notification error');
        const response = factory.createErrorResponse(error);
        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual(error.message);
    });

    it('Should create server error response for ArchiveError', ()=>{
        const error = new ArchiveError('archive error');
        const response = factory.createErrorResponse(error);
        expect(response.statusCode).toEqual(500);
        expect(response.body).toEqual(error.message);
    });
});