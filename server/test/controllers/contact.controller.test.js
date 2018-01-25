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
const controllers_1 = require("../../controllers");
let req;
let res;
describe("contact Controller", () => {
    beforeEach(() => {
        req = {};
        res = {
            send: sinon.spy(),
        };
    });
    describe("getContactPage", () => {
        it("should successful retrieve", () => __awaiter(this, void 0, void 0, function* () {
            const expectedData = [{ name: "aaa" }];
            yield controllers_1.contactController.getContactPage(req, res);
            sinon.assert.calledWith(res.send, "Contact page for Identity Service");
        }));
    });
});
