import { Request, Response } from "express";
import * as sinon from "sinon";
import { expect } from "chai";

import { contactController } from "../../controllers";
import { Readable } from "stream";

let req: Partial<Request>;
let res: Partial<Response>;

describe("contact Controller", () => {

    beforeEach(() => {
        req = {};
        res = {
            send: sinon.spy(),
        };
    });

    describe("getContactPage", () => {
        it("should successful retrieve", async () => {
            const expectedData = [{ name: "aaa" }];
            await contactController.getContactPage(req as Request, res as Response);

            sinon.assert.calledWith(res.send as sinon.SinonSpy, "Contact page for Identity Service");
        });
    });

});
