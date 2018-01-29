"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_error_1 = require("./application.error");
class BadRequestError extends application_error_1.ApplicationError {
    constructor(message) {
        super(message || "Sintaxa gresita.", 400);
    }
}
exports.BadRequestError = BadRequestError;
class ValidationError extends application_error_1.ApplicationError {
    constructor(message) {
        super(message || "Resursa negasita.", 422);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends application_error_1.ApplicationError {
    constructor(message) {
        super(message || "Resursa negasita.", 404);
    }
}
exports.NotFoundError = NotFoundError;
