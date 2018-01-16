"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const _ = require("lodash");
exports.buildUrl = (redirectUri, options, hash) => {
    const newUrlObj = url.parse(redirectUri, true);
    delete newUrlObj.search;
    if (!newUrlObj.query) {
        newUrlObj.query = {};
    }
    _.each(options, (value, key, list) => {
        newUrlObj.query[key] = value;
    });
    if (hash) {
        newUrlObj.hash = hash;
    }
    return url.format(newUrlObj);
};
