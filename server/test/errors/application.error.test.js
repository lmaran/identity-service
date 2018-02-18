"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const err = require("../../errors");
const err1 = new err.ValidationError("err1");
chai_1.expect(err1.status).equals(400);
chai_1.expect(err1.returnAs).equals("json");
const err2 = new err.ApplicationError(300, "err1");
chai_1.expect(err2.status).equals(300);
chai_1.expect(err2.returnAs).equals("json");