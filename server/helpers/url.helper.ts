import * as url from "url";
import * as _ from "lodash";
import { Url, UrlObject } from "url";

import { IOptionsUri } from "../interfaces";
import { stringHelper } from "../helpers";

// merge 'options' into 'redirectUri' (as query string)
export const urlHelper = {
    buildUrl: (redirectUri, options: IOptionsUri, hash) => {
        const newUrlObj: UrlObject = url.parse(redirectUri, true) || {}; // convert url -> object
        delete newUrlObj.search;
        if (!newUrlObj.query) {
            newUrlObj.query = {};
        }
        // add each option to the query
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

    getTenantCode: (subdomains: string[]) => {
        // example for "http://cantinas.dev.identity.appstudio.ro/":
        // input = ["identity", "dev", "cantinas"] // an array of all subdomains in reverse order
        // output = "cantinas"
        let tenantCode;
        if (subdomains && subdomains.length > 0 ) {
            tenantCode = _.last(subdomains);
            if (urlHelper.isReservedSubdomain(tenantCode)) {
                tenantCode = undefined;
            }
        }
        return tenantCode;
    },

    isReservedSubdomain: (subdomain: string) => {
        const isReserved1 = ["stg", "temp", "temp-stg", "blue", "blue-stg", "green", "green-stg", "dev"].includes(subdomain);
        const isReserved2 = stringHelper.endsWithValueFromList(subdomain, ["-blue", "-green", "-blue-stg", "-green-stg"]);
        return isReserved1 || isReserved2;
    },

};
