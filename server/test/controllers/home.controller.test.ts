import { Request, Response } from "express";
import * as sinon from "sinon";
import { expect } from "chai";

import { homeController } from "../../controllers";

let req: Partial<Request>;
let res: Partial<Response>;

describe("home Controller", () => {

    beforeEach(() => {
        req = {};
        res = {
            send: sinon.spy(),
        };
    });

    describe("getHomePage", () => {
        it("should successful retrieve", async () => {
            const expectedData = [{ name: "aaa" }];
            await homeController.getHomePage(req as Request, res as Response);

            sinon.assert.calledWith(res.send as sinon.SinonSpy, "Hello Identity Service for noApp (noEnv)");
        });
    });

});
