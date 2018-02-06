// import { Request, Response, NextFunction } from "express";
// import * as sinon from "sinon";
// import { expect } from "chai";

// import { homeController } from "../../controllers";

// let req: Partial<Request>;
// let res: Partial<Response>;
// let next: Partial<NextFunction>;

// describe("home Controller", () => {

//     beforeEach(() => {
//         req = {};
//         res = {
//             send: sinon.spy(),
//         };
//         next = () => undefined;
//     });

//     describe("getHomePage", () => {
//         it("should successful retrieve", async () => {
//             const expectedData = [{ name: "aaa" }];
//             await homeController.getHomePage(req as Request, res as Response, next as NextFunction);

//             sinon.assert.calledWith(res.send as sinon.SinonSpy, "Hello Identity Service for noApp (noEnv)");
//         });
//     });

// });
