import { expect } from "chai";

class ApplicationError extends Error {
    private _status?: number;
    private _returnType?: string;

    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;

        // Capture the current stack trace and store it in the property "this.stack".
        Error.captureStackTrace(this, this.constructor);
    }

    // this public methods act as properties (getters)
    get status() { return this._status || 400; }
    get returnType() { return this._returnType || "json"; }

    // we use chainable methods instead of setters
    public withStatus(status: number) {
        this._status = status;
        return this;
    }

    public returnAs(returnType) {
        this._returnType = returnType;
        return this;
    }

}

const err1 = new ApplicationError("err1").withStatus(422).returnAs("render");
expect(err1.status).equals(422);
expect(err1.returnType).equals("render");

const err2 = new ApplicationError("err1");
expect(err2.status).equals(400);
expect(err2.returnType).equals("json");
