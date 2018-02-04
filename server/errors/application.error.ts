// or use a dedicated npm module (like http-errors): https://github.com/jshttp/http-errors
// https://medium.com/learn-with-talkrise/custom-errors-with-node-express-27b91fe2d947

// with this module, we can use:
    // throw new ApplicationError("Missing tenant", 400);

// ...otherwise, we have to use:
    // err = new Error("Missing tenant");
    // err.code = 400;
    // throw err;

    // all these errors are finally caught by an errorHandler middleware

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    // https://stackoverflow.com/a/32749533
    // https://www.loggly.com/blog/node-js-error-handling/

import { IErrorOptions } from "@interfaces";

export class ApplicationError extends Error {
    public requestId?: string;
    public status: any;
    public errorOptions?: IErrorOptions;

    constructor(status: number, message: string, errorOptions?: IErrorOptions) {
        super(message || "Something went wrong. Please try again.");
        this.name = this.constructor.name;

        this.status = status || 500;
        this.errorOptions = errorOptions;

        // Capture the current stack trace and store it in the property "this.stack".
        Error.captureStackTrace(this, this.constructor);
    }
}
