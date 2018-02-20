"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    port: process.env.PORT || 1420,
    mongo: {
        uri: "mongodb://localhost",
        dbName: "identity-service-dev",
    },
    rollbarToken: "<rollbarToken>",
    logglyToken: "<logglyToken>",
    logglySubdomain: "<logglySubdomain>",
    logLevel: "debug",
    httpLogDetails: {
        request: {
            general: "partial",
            headers: "empty",
            body: "empty",
        },
        response: {
            general: "empty",
            headers: "empty",
            body: "empty",
        },
    },
};
exports.default = config;
