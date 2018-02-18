"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApplicationError extends Error {
    constructor(status, message) {
        super(message);
        this._status = 500;
        this.name = this.constructor.name;
        this._status = status;
        Error.captureStackTrace(this, this.constructor);
    }
    get status() { return this._status; }
    set status(status) { this._status = status; }
    withStatus(status) {
        this._status = status;
        return this;
    }
    get developerMessage() { return this._developerMessage; }
    set developerMessage(developerMessage) { this._developerMessage = developerMessage; }
    withDeveloperMessage(developerMessage) {
        this._developerMessage = developerMessage;
        return this;
    }
    get returnAs() { return this._returnAs; }
    set returnAs(returnAs) { this._returnAs = returnAs; }
    withReturnAs(returnAs) {
        this._returnAs = returnAs;
        return this;
    }
    get redirectUri() { return this._redirectUri; }
    set redirectUri(redirectUri) { this._redirectUri = redirectUri; }
    withRedirectUri(uri) {
        this._redirectUri = uri;
        return this;
    }
}
exports.ApplicationError = ApplicationError;
