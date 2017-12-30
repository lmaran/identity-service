"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const chai_1 = require("chai");
const check_controller_1 = require("./check.controller");
let req;
let res;
describe("check Controller", () => {
    beforeEach(function () {
        req = {};
        res = {
            send: sinon.spy(),
            json: sinon.spy(),
        };
    });
    it("should exist", function () {
        chai_1.expect(check_controller_1.default).to.exist;
    });
    describe("getCheckPage", () => {
        it("should send json on successful retrieve", () => __awaiter(this, void 0, void 0, function* () {
            yield check_controller_1.default.getCheckPage(req, res);
            sinon.assert.calledWith(res.send, "identity-service-" + (process.env.DEPLOYMENT_SLOT || "noslot") + "-" + process.env.NODE_ENV);
        }));
    });
});
