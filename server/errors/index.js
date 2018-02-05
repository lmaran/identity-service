"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_error_1 = require("./application.error");
class BadRequest extends application_error_1.ApplicationError {
    constructor(message, errorOptions) {
        super(400, message, errorOptions);
    }
}
exports.BadRequest = BadRequest;
class ValidationError extends application_error_1.ApplicationError {
    constructor(message, errorOptions) {
        super(400, message, errorOptions);
    }
}
exports.ValidationError = ValidationError;
class Unauthorized extends application_error_1.ApplicationError {
    constructor(message, errorOptions) {
        super(401, message, errorOptions);
    }
}
exports.Unauthorized = Unauthorized;
class Forbidden extends application_error_1.ApplicationError {
    constructor(errorOptions) {
        super(403, "Forbidden", errorOptions);
    }
}
exports.Forbidden = Forbidden;
class NotFound extends application_error_1.ApplicationError {
    constructor(errorOptions) {
        super(404, "Not Found", errorOptions);
    }
}
exports.NotFound = NotFound;
