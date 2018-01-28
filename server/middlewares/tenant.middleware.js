"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.getTenant = (req, res, next) => {
    const subdomains = req.subdomains;
    let tenantCode;
    if (subdomains && subdomains.length > 0) {
        tenantCode = _.last(subdomains);
    }
    req.tenantCode = tenantCode;
    next();
};
