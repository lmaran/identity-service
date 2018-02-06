// import { Request, Response, NextFunction } from "express";
// import * as sinon from "sinon";
// import { expect } from "chai";

// import { contactController } from "../../controllers";
// import { Readable } from "stream";

// let req: Partial<Request>;
// let res: Partial<Response>;
// let next: Partial<NextFunction>;

// describe("contact Controller", () => {

//     beforeEach(() => {
//         req = {};
//         res = {
//             send: sinon.spy(),
//         };
//         next = () => undefined;
//     });

//     describe("getContactPage", () => {
//         it("should successful retrieve", async () => {
//             const expectedData = [{ name: "aaa" }];
//             await contactController.getContactPage(req as Request, res as Response, next as NextFunction);

//             sinon.assert.calledWith(res.send as sinon.SinonSpy, "Contact page for Identity Service");
//         });
//     });

// });
