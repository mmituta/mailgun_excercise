import { APIGatewayProxyResult } from "aws-lambda";
import { BadRequestError } from "./errors/bad-request-error";
import { ServerError } from "./errors/server-error";
import { VerificationError } from "./verification/verification-error";

export class ResponseFactory {
    public createSuccessResponse(): APIGatewayProxyResult {
        return this.newResponse(200, `Web hook successfully processed`);
    }

    public createErrorResponse(err: Error): APIGatewayProxyResult {
        if (err instanceof BadRequestError) {
            return this.badRequestResponse(err)
        }
        if (err instanceof ServerError) {
            return this.serverErrorResponse(err)
        }
    }


    private serverErrorResponse(err: ServerError): APIGatewayProxyResult {
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