import * as _ from "lodash";
import { tokenService } from "../services";

export const getTenant = async (req, res, next) => {
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
