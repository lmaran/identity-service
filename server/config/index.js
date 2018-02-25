"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const env = (process.env.NODE_ENV || "development").toLowerCase();
const envConfig = require(`./${env}`).default;
const common = {
    env,
    port: process.env.PORT || 1420,
    mongo: {
        uri: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME,
    },
    rollbarToken: process.env.ROLLBAR_TOKEN,
    logglyToken: process.env.LOGGLY_TOKEN,
    logglySubdomain: process.env.LOGGLY_SUBDOMAIN,
    logLevel: process.env.LOG_LEVEL || "warning",
    httpLogDetails: {
        request: {
            general: process.env.HTTP_LOG_DETAILS_REQUEST_GENERAL || "full",
            headers: process.env.HTTP_LOG_DETAILS_REQUEST_HEADERS || "partial",
            body: process.env.HTTP_LOG_DETAILS_REQUEST_BODY || false,
        },
        response: {
            general: process.env.HTTP_LOG_DETAILS_RESPONSE_GENERAL || false,
            headers: process.env.HTTP_LOG_DETAILS_RESPONSE_HEADERS || false,
            body: process.env.HTTP_LOG_DETAILS_RESPONSE_BODY || false,
        },
    },
};
const config = _.merge(common, envConfig);
exports.default = config;
