import { APIGatewayProxyResult } from "aws-lambda";
import { ArchiveError } from "./archive/archive-error";
import { NotificationError } from "./notification/notification-error";
import { VerificationError } from "./verification/verification-error";

export class ResponseFactory {
    public createSuccessResponse(): APIGatewayProxyResult {
        return this.newResponse(200, `Web hook successfully processed`);
    }

    public createErrorResponse(err: Error): APIGatewayProxyResult {
        if (err instanceof VerificationError) {
            return this.badRequestResponse(err)
        }
        if (err instanceof NotificationError || err instanceof ArchiveError) {
            return this.serverErrorResponse(err)
        }
    }


    private serverErrorResponse(err: NotificationError | ArchiveError): APIGatewayProxyResult {
        return this.newResponse(500, err.message);
    }

    private badRequestResponse(err: VerificationError): APIGatewayProxyResult {
        return this.newResponse(400, err.message);
    }

    private newResponse(code: number, message: string): APIGatewayProxyResult {
        return {
            statusCode: code,
            body: message
        };
    }
}