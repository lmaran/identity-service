"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApplicationError extends Error {
    constructor(status, message, errorOptions) {
        super(message || "Something went wrong. Please try again.");
        this.name = this.constructor.name;
        this.status = status || 500;
        this.errorOptions = errorOptions;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApplicationError = ApplicationError;
