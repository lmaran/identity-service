import { Request, Response } from "express";
import * as sinon from "sinon";
import { expect } from "chai";

import homeController from "./home.controller";

let req: Partial<Request>;
let res: Partial<Response>;

describe("home Controller", () => {

    beforeEach(function() {
        req = {};
        res = {
            send: sinon.spy(),
        };
    });

    it("should exist", function() {
        expect(homeController).to.exist;
    });

    describe("getHomePage", () => {
        it("should successful retrieve", async () => {
            const expectedData = [{ name: "aaa" }];
            await homeController.getHomePage(<Request>req, <Response>res);

            sinon.assert.calledWith(res.send as sinon.SinonSpy, "Hello Identity Service");
        });
    });

});