import { Request, Response } from "express";
import * as sinon from "sinon";
import { expect } from "chai";

import contactController from "./contact.controller";

let req: Partial<Request>;
let res: Partial<Response>;

describe("contact Controller", () => {

    beforeEach(function() {
        req = {};
        res = {
            send: sinon.spy(),
        };
    });

    it("should exist", function() {
        expect(contactController).to.exist;
    });

    describe("getContactPage", () => {
        it("should successful retrieve", async () => {
            const expectedData = [{ name: "aaa" }];
            await contactController.getContactPage(<Request>req, <Response>res);

            sinon.assert.calledWith(res.send as sinon.SinonSpy, "Contact page for Identity Service");
        });
    });

});