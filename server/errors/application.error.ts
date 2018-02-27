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

// import { IErrorOptions } from "../interfaces";
import { ReturnType } from "../constants";

export class ApplicationError extends Error {
    // instance fields with default values
    private _status: number = 500;
    private _developerMessage?: string | undefined;
    private _returnAs: ReturnType | undefined;
    private _redirectUri?: URL | undefined;

    constructor(status: number, message?: string) {
        super(message);
        this.name = this.constructor.name;
        this._status = status;

        // Capture the current stack trace and store it in the property "this.stack".
        Error.captureStackTrace(this, this.constructor);
    }

    // getters, setters and chaining methods
    get status() { return this._status; }
    set status(status: number) { this._status = status; }
    public withStatus(status: number) {
        this._status = status;
        return this;
    }

    get developerMessage() { return this._developerMessage; }
    set developerMessage(developerMessage: string | undefined) { this._developerMessage = developerMessage; }
    public withDeveloperMessage(developerMessage: string) {
        this._developerMessage = developerMessage;
        return this;
    }

    get returnAs() { return this._returnAs; }
    set returnAs(returnAs: ReturnType | undefined) { this._returnAs = returnAs; }
    public withReturnAs(returnAs: ReturnType) {
        this._returnAs = returnAs;
        return this;
    }

    get redirectUri() { return this._redirectUri; }
    set redirectUri(redirectUri: URL | undefined) { this._redirectUri = redirectUri; }
    public withRedirectUri(uri: URL) {
        this._redirectUri = uri;
        return this;
    }
}
