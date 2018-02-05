import * as _ from "lodash";
import { Request, Response, NextFunction } from "express";
import { tokenService } from "../services";
import { IContext } from "@interfaces";
import { isContext } from "vm";
import * as randomstring from "randomstring";

export const setContext = async (req: Request, res: Response, next: NextFunction) => {

    // 1. set requestId
    req.ctx.requestId = randomstring.generate(8);

    // 2. set tenantCode

    // Host: "http://cantinas.dev.identity.appstudio.ro/"
    // => subdomains = ["identity", "dev", "cantinas"]
    // => tenantCode = "cantinas"
    const subdomains = req.subdomains;
    let tenantCode;
    if (subdomains && subdomains.length > 0 ) {
        tenantCode = _.last(subdomains);
    }
    req.ctx.tenantCode = tenantCode;

    next();
};
