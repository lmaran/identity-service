"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const env = (process.env.NODE_ENV || "development").toLowerCase();
const envConfig = require(`./${env}`).default;
const common = {
    env,
    logLevel: process.env.LOG_LEVEL || "warning",
    httpLogDetails: {
        request: {
            general: process.env.HTTP_LOG_DETAILS_REQUEST_GENERAL || "full",
            headers: process.env.HTTP_LOG_DETAILS_REQUEST_HEADERS || "partial",
            body: process.env.HTTP_LOG_DETAILS_REQUEST_BODY || "empty",
        },
        response: {
            general: process.env.HTTP_LOG_DETAILS_RESPONSE_GENERAL || "empty",
            headers: process.env.HTTP_LOG_DETAILS_RESPONSE_HEADERS || "empty",
            body: process.env.HTTP_LOG_DETAILS_RESPONSE_BODY || "empty",
        },
    },
};
const config = _.merge(common, envConfig);
exports.default = config;
