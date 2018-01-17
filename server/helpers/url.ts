import * as url from "url";
import * as _ from "lodash";
import { IOptionsUri } from "@interfaces";
import { Url, UrlObject } from "url";

// merge 'options' into 'redirectUri' (as query string)
export const buildUrl = (redirectUri, options: IOptionsUri, hash) => {
    const newUrlObj: UrlObject = url.parse(redirectUri, true); // convert url -> object
    delete newUrlObj.search;
    if (!newUrlObj.query) {
        newUrlObj.query = {};
    }
    // add each option to the query
    _.each(options, (value, key, list) => {
        newUrlObj.query[key] = value;
    });
    if (hash) {
        newUrlObj.hash = hash;
    }

    return url.format(newUrlObj);
};
