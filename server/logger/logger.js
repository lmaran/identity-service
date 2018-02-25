"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const config_1 = require("../config");
require("./winston-rollbar.transport");
require("./winston-loggly.transport");
const rollbarOptions = {
    accessToken: config_1.default.rollbarToken,
    reportLevel: "warning",
    environment: config_1.default.env,
    scrubFields: ["password", "oldPassword", "newPassword", "hashedPassword", "salt"],
};
const logglyOptions = {
    token: config_1.default.logglyToken,
    subdomain: config_1.default.logglySubdomain,
    tags: ["identity-service", config_1.default.env],
    json: true,
};
const logger = new winston.Logger();
if (config_1.default.env === "production" || config_1.default.env === "staging") {
    logger.add(winston.transports.Rollbar, rollbarOptions);
    logger.add(winston.transports.Loggly, logglyOptions);
}
else {
    const formatterFunc = require("./winston-console.formatter").formatterFunc;
    const consoleOptions = {
        level: "debug",
        formatter: formatterFunc,
    };
    logger.add(winston.transports.Console, consoleOptions);
}
exports.default = logger;
