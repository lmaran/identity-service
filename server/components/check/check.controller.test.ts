import { Request, Response } from "express";
import * as sinon from "sinon";
import { expect } from "chai";

import checkController from "./check.controller";

let req: Partial<Request>;
let res: Partial<Response>;

describe("check Controller", () => {

    beforeEach(() => {
        req = {};
        res = {
            send: sinon.spy(),
            json: sinon.spy(),
        };
    });

    describe("getCheckPage", () => {
        it("should send json on successful retrieve", async () => {
            await checkController.getCheckPage(req as Request, res as Response);
            sinon.assert.calledWith(res.send as sinon.SinonSpy, "identity-service-" + (process.env.DEPLOYMENT_SLOT || "noslot") + "-" + process.env.NODE_ENV);
        });
    });

});
