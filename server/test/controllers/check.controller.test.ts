// import { Request, Response, NextFunction } from "express";
// import * as sinon from "sinon";
// import { expect } from "chai";

// import { checkController } from "../../controllers";

// let req: Partial<Request>;
// let res: Partial<Response>;
// let next: Partial<NextFunction>;

// describe("check Controller", () => {

//     beforeEach(() => {
//         req = {};
//         res = {
//             send: sinon.spy(),
//             json: sinon.spy(),
//         };
//         next = () => undefined;
//     });

//     describe("getCheckPage", () => {
//         it("should send json on successful retrieve", async () => {
//             await checkController.getCheckPage(req as Request, res as Response, next as NextFunction );
//             sinon.assert.calledWith(res.send as sinon.SinonSpy, "identity-service-" + (process.env.DEPLOYMENT_SLOT || "noslot") + "-" + process.env.NODE_ENV);
//         });
//     });

// });
