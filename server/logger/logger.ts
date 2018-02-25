// we use v2.x version of winston (as v3.x in still in RC )

// common signature:
//      logger.info("message", meta); where:
//          meta is an optional object
//          log levels: error-0, warn-1, info-2, debug-3 (we use only 4)

// source                   | format                                  | dest
// ----------------------------------------------------------------------------
// Server err handler (5xx) | log.error("serverError", {err}          | Rollbar
// Unhandled err. handler:  | log.error("unhandledError", {err})      | Rollbar
// Code (warn)              | log.warn("message", {optional-meta})    | Rollbar
// ----------------------------------------------------------------------------
// Code (info)              | log.info("message", {optional-meta})    | Loggly
// Code (debug)             | log.debug("message", {optional-meta})   | Loggly
// HttpLogHandler           | log.info("httpLogHandler", {req, res})  | Loggly
// Client err handler (4xx) | log.info("clientError", {err})          | Loggly

import * as winston from "winston";
import config from "../config";
import { EnvironmentType, LogLevel } from "../constants";
// import { formatterFunc } from "./winston-console.formatter";

require("./winston-rollbar.transport"); // init Rollbar transport for Winston
require("./winston-loggly.transport");

const rollbarOptions = {
    accessToken: config.rollbarToken,
    reportLevel: LogLevel.WARNING,  // catches just errors and warnings; default: "warning"
    environment: config.env,
    scrubFields: ["password", "oldPassword", "newPassword", "hashedPassword", "salt"],
};

const logglyOptions = {
    token: config.logglyToken,
    subdomain: config.logglySubdomain,
    tags: ["identity-service", config.env],
    json: true,
};

const logger = new winston.Logger();

// Winston && Rollbar: debug > info > warning > error
// E.g. 'info' level catches also 'warning' or 'error' but not 'debug'

if (config.env === EnvironmentType.PRODUCTION || config.env === EnvironmentType.STAGING) {
    logger.add(winston.transports.Rollbar, rollbarOptions);
    logger.add(winston.transports.Loggly, logglyOptions);
} else { // development
    const formatterFunc = require("./winston-console.formatter").formatterFunc;
    const consoleOptions = {
        level: LogLevel.DEBUG, // catches all messages
        formatter: formatterFunc,
    };
    logger.add(winston.transports.Console, consoleOptions);
}

export default logger;
