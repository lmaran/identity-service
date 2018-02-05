// tslint:disable:max-classes-per-file

// export * from "./approve.controller";

// or use a dedicated module: https://github.com/jshttp/http-errors
// https://medium.com/learn-with-talkrise/custom-errors-with-node-express-27b91fe2d947

// with this module, we can use:
// throw new ApplicationError("Missing tenant", 400);

// ...otherwise, we have to use:
// err = new Error("Missing tenant");
// err.code = 400;
// throw err;

// all these errors are finally caught by an errorHandler middleware

// export class ApplicationError extends Error {
//     private status: any;
//     constructor(message, status) {
//         super();

//         Error.captureStackTrace(this, this.constructor);

//         this.name = this.constructor.name;

//         this.message = message || "Something went wrong. Please try again.";

//         this.status = status || 500;
//     }
// }

import { ApplicationError } from "./application.error";
import { ReturnAs } from "../constants";
import { IErrorOptions } from "@interfaces";

// https://www.quora.com/Which-HTTP-code-is-best-suited-for-validation-errors-400-or-422
// ex: http:localhost:8080/getDetails?user_id=12345

// Use 400 (BadRequest) if the query is syntactically incorrect
// ex: you do not provide the user_id
export class BadRequest extends ApplicationError {
    constructor(message, errorOptions?: IErrorOptions) {
        super(400, message, errorOptions);
    }
}

// Use 422 (Unprocessable Entity) if the query is well formatted but semantically incorrect
// ex: you provide the user_id but it's not valid i.e a -43.67
export class ValidationError extends ApplicationError {
    constructor(message, errorOptions?: IErrorOptions) {
        super(400, message, errorOptions);
    }
}

export class Unauthorized extends ApplicationError {
    constructor(message, errorOptions?: IErrorOptions) {
        super(401, message, errorOptions);
    }
}

export class Forbidden extends ApplicationError {
    constructor(errorOptions?: IErrorOptions) {
        super(403, "Forbidden", errorOptions);
    }
}

// Use 404 (NotFound) if the resource you address in URL is not found
export class NotFound extends ApplicationError {
    constructor(errorOptions?: IErrorOptions) {
        super(404, "Not Found", errorOptions);
    }
}
