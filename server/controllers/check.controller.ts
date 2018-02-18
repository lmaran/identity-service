import { Request, Response, NextFunction } from "express";
import logger from "../logger";
import { BadRequest } from "../errors";

export const checkController = {

    getCheckPage: async (req: Request, res: Response, next: NextFunction) => {

        try {
            // set DEPLOYMENT_SLOT as env variable on remote server
            // e.g. "celebrate-taste-blue-staging"
            // logger.error("xx3-aaabbc");
            // throw new BadRequest("bb-test1").withDeveloperMessage("some dev details");
            // throw new Error("aa-test1");

            // tslint:disable-next-line:no-string-throw
            // throw "aaa";
            res.send("identity-service-" + (process.env.DEPLOYMENT_SLOT || "noslot") + "-" + process.env.NODE_ENV);
        } catch (err) {
            next(err);
        }
    },

};
