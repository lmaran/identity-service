"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_error_1 = require("./application.error");
class BadRequestError extends application_error_1.ApplicationError {
    constructor(message) {
        super(400, message || "Sintaxa gresita.");
    }
}
exports.BadRequestError = BadRequestError;
class ValidationError extends application_error_1.ApplicationError {
    constructor(message, errorOptions) {
        super(400, message || "Eroare de validare.", errorOptions);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends application_error_1.ApplicationError {
    constructor(message) {
        super(404, message || "Resursa negasita.");
    }
}
exports.NotFoundError = NotFoundError;
