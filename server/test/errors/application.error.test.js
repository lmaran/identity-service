"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
class ApplicationError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
    get status() { return this._status || 400; }
    get returnType() { return this._returnType || "json"; }
    withStatus(status) {
        this._status = status;
        return this;
    }
    returnAs(returnType) {
        this._returnType = returnType;
        return this;
    }
}
const err1 = new ApplicationError("err1").withStatus(422).returnAs("render");
chai_1.expect(err1.status).equals(422);
chai_1.expect(err1.returnType).equals("render");
const err2 = new ApplicationError("err1");
chai_1.expect(err2.status).equals(400);
chai_1.expect(err2.returnType).equals("json");
