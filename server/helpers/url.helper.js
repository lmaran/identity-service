"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const _ = require("lodash");
const helpers_1 = require("../helpers");
exports.urlHelper = {
    buildUrl: (redirectUri, options, hash) => {
        const newUrlObj = url.parse(redirectUri, true) || {};
        delete newUrlObj.search;
        if (!newUrlObj.query) {
            newUrlObj.query = {};
        }
        _.each(options, (value, key, list) => {
            const q = newUrlObj.query;
            if (q) {
                q[key] = value;
            }
        });
        if (hash) {
            newUrlObj.hash = hash;
        }
        return url.format(newUrlObj);
    },
    getTenantCode: (subdomains) => {
        let tenantCode;
        if (subdomains && subdomains.length > 0) {
            tenantCode = _.last(subdomains);
            if (exports.urlHelper.isReservedSubdomain(tenantCode)) {
                tenantCode = undefined;
            }
        }
        return tenantCode;
    },
    isReservedSubdomain: (subdomain) => {
        const isReserved1 = ["stg", "temp", "temp-stg", "blue", "blue-stg", "green", "green-stg", "dev"].includes(subdomain);
        const isReserved2 = helpers_1.stringHelper.endsWithValueFromList(subdomain, ["-blue", "-green", "-blue-stg", "-green-stg"]);
        return isReserved1 || isReserved2;
    },
};
