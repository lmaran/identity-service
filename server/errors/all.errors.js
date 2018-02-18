"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_error_1 = require("./application.error");
class BadRequest extends application_error_1.ApplicationError {
    constructor(message) {
        super(400, message);
    }
}
exports.BadRequest = BadRequest;
class ValidationError extends application_error_1.ApplicationError {
    constructor(message) {
        super(400, message);
    }
}
exports.ValidationError = ValidationError;
class Unauthorized extends application_error_1.ApplicationError {
    constructor(message) {
        super(401, message);
    }
}
exports.Unauthorized = Unauthorized;
class Forbidden extends application_error_1.ApplicationError {
    constructor() {
        super(403, "Forbidden");
    }
}
exports.Forbidden = Forbidden;
class NotFoundError extends application_error_1.ApplicationError {
    constructor() {
        super(404, "Resursa negasita");
    }
}
exports.NotFoundError = NotFoundError;
class PageNotFound extends application_error_1.ApplicationError {
    constructor(message) {
        super(404, message);
    }
}
exports.PageNotFound = PageNotFound;
