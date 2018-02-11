import { Request, Response, NextFunction } from "express";
import logger from "../logger";

export const checkController = {

    getCheckPage: async (req: Request, res: Response, next: NextFunction) => {

        try {
            // set DEPLOYMET_SLOT as env variable on remote server
            // e.g. "celebrate-taste-blue-staging"
            // logger.info("xx-aaabbc");
            // res.send("identity-service-" + (process.env.DEPLOYMENT_SLOT || "noslot") + "-" + process.env.NODE_ENV);
            throw new Error("bb-test1");
            // res.send("identity-service-" + (process.env.DEPLOYMENT_SLOT || "noslot") + "-" + process.env.NODE_ENV);
        } catch (err) {
            next(err);
        }
    },

};
