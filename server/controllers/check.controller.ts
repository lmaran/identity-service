import { Request, Response, NextFunction } from "express";

export const checkController = {

    getCheckPage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // set DEPLOYMET_SLOT as env variable on remote server
            // e.g. "celebrate-taste-blue-staging"
            res.send("identity-service-" + (process.env.DEPLOYMENT_SLOT || "noslot") + "-" + process.env.NODE_ENV);
        } catch (err) {
            next(err);
        }
    },

};
