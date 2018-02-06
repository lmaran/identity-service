import * as _ from "lodash";
import { Request, Response, NextFunction } from "express";
import { tokenService } from "../services";
import { IContext } from "@interfaces";
import { isContext } from "vm";
import * as randomstring from "randomstring";
import { urlHelper } from "../helpers";

export const setContext = async (req: Request, res: Response, next: NextFunction) => {

    req.ctx = {};

    // 1. set requestId
    // req.ctx.requestId = randomstring.generate(8);

    // // 2. set tenantCode
    // req.ctx.tenantCode = urlHelper.getTenantCode(req.subdomains);

    next();
};
