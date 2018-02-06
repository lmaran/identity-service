"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_error_1 = require("./application.error");
var application_error_2 = require("./application.error");
exports.ApplicationError = application_error_2.ApplicationError;
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
class NotFound extends application_error_1.ApplicationError {
    constructor() {
        super(404, "Not Found");
    }
}
exports.NotFound = NotFound;
