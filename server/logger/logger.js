"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const chalk = require("chalk");
const config_1 = require("../config");
require("./winston-rollbar.transport");
require("winston-loggly-bulk");
const rollbarOptions = {
    reportLevel: "warn",
    rollbarAccessToken: config_1.default.rollbarToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    rollbarConfig: {
        environment: config_1.default.env,
        scrubFields: ["password", "oldPassword", "newPassword", "hashedPassword", "salt"],
    },
};
const logglyOptions = {
    token: config_1.default.logglyToken,
    subdomain: config_1.default.logglySubdomain,
    tags: ["identity-service", config_1.default.env],
    json: true,
};
const consoleOptions = {
    level: "debug",
    formatter: formatterFunc,
};
const logger = new winston.Logger();
if (config_1.default.env === "production" || config_1.default.env === "staging" || config_1.default.env === "development") {
    logger.add(winston.transports.Loggly, logglyOptions);
}
else {
    logger.add(winston.transports.Console, consoleOptions);
}
function formatterFunc(options) {
    const meta = options.meta;
    let msg = "";
    if (options.level === "info" || options.level === "warn") {
        if (meta && meta.hasOwnProperty("req")) {
            msg = msg + meta.req.method + " " + meta.req.url;
            if (meta.res) {
                msg = msg + " " + getColorStatus(meta.res.statusCode) + " - " + meta.res.responseTime + " ms ";
            }
        }
        else {
            msg = msg + (undefined !== options.message ? options.message : "");
            if (meta && Object.keys(meta).length > 0) {
                msg = msg + "\n" + JSON.stringify(meta, null, 4);
            }
        }
    }
    else if (options.level === "error") {
        if (meta && meta.req) {
            msg = msg + meta.req.method + " " + meta.req.url;
        }
    }
    return winston.config.colorize(options.level) + " " + msg;
}
function getColorStatus(status) {
    let statusColor = "green";
    if (status >= 500) {
        statusColor = "red";
    }
    else if (status >= 400) {
        statusColor = "yellow";
    }
    else if (status >= 300) {
        statusColor = "cyan";
    }
    return chalk[statusColor](status);
}
exports.default = logger;
