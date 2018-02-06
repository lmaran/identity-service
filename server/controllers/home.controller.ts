import { Request, Response, NextFunction } from "express";
import { stringHelper } from "../helpers";
import * as err from "../errors";
import { ReturnType } from "../constants";

export const homeController = {

    getHomePage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tenantCode = req.ctx.tenantCode;
            if (!tenantCode) {
                // throw new err.ValidationError("Missing tenant")
                //     .withDeveloperMessage("There was no tenant code")
                //     .withReturnAs(ReturnType.RENDER);
                res.send("No tenant!");
                return;
            }

            res.send(`Hello Identity Service for ${tenantCode}`);
        } catch (err) {
            next(err);
        }
    },

};
