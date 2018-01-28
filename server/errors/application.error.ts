// or use a dedicated module: https://github.com/jshttp/http-errors
// https://medium.com/learn-with-talkrise/custom-errors-with-node-express-27b91fe2d947

// with this module, we can use:
    // throw new ApplicationError("Missing tenant", 400);

// ...otherwise, we have to use:
    // err = new Error("Missing tenant");
    // err.code = 400;
    // throw err;

// all these errors are finally caught by an errorHandler middleware

export class ApplicationError extends Error {
    private status: any;
    constructor(message, status) {
        super();

        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;

        this.message = message || "Something went wrong. Please try again.";

        this.status = status || 500;
    }
}
