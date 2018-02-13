// import * as winston from "winston";
// const winston = require("winston");
import * as winston from "winston";
import * as chalk from "chalk";
import config from "../config";
import { EnvironmentType } from "../constants";

require("./winston-rollbar.transport"); // init Rollbar transport for Winston
// require("winston-loggly"); // init Loggly transport for Winston
require("winston-loggly-bulk");

// const rollbarOptions = {
//     reportLevel: "warn",  // catches just errors and warnings
//     rollbarAccessToken: config.rollbarToken,
//     captureUncaught: true,
//     captureUnhandledRejections: true,
//     rollbarConfig: {
//         environment: config.env,
//         scrubFields: ["password", "oldPassword", "newPassword", "hashedPassword", "salt"],
//         // enabled: false // Sets whether reporting of errors to Rollbar is enabled (default true)
//     },
// };

const rollbarOptions = {
    accessToken: config.rollbarToken,
    reportLevel: "warning",  // catches just errors and warnings; default: "warning"
    environment: config.env,
    scrubFields: ["password", "oldPassword", "newPassword", "hashedPassword", "salt"],
    captureUncaught: true,
    captureUnhandledRejections: true,
};

const logglyOptions = {
    // token: config.logglyToken,
    token: config.logglyToken,
    subdomain: config.logglySubdomain,
    tags: ["identity-service", config.env],
    json: true,
};

const consoleOptions = {
    level: "debug", // catches all messages
    formatter: formatterFunc,
};

const logger = new winston.Logger();

// Winston && Rollbar: debug > info > warning > error
// E.g. 'info' level catches also 'warning' or 'error' but not 'debug'

if (config.env === EnvironmentType.PRODUCTION || config.env !== EnvironmentType.STAGING) {
    logger.add(winston.transports.Rollbar, rollbarOptions);
    logger.add(winston.transports.Loggly, logglyOptions);
} else { // development
    logger.add(winston.transports.Console, consoleOptions);
}

function formatterFunc(options) {
    // Return string will be passed to logger.
    const meta = options.meta;
    let msg = "";

    if (options.level === "info" || options.level === "warn") {
        if (meta && meta.hasOwnProperty("req")) {
            msg = msg + meta.req.method + " " + meta.req.url;
            if (meta.res) {
                msg = msg + " " + getColorStatus(meta.res.statusCode) + " - " + meta.res.responseTime + " ms "; // + meta.res.responseTime2;
            }
        } else {
            msg = msg + (undefined !== options.message ? options.message : "");
            if (meta && Object.keys(meta).length > 0) {
                msg = msg + "\n" + JSON.stringify(meta, null, 4);
            }
        }
    } else if (options.level === "error") {

        if (meta && meta.req) { // meta has a 'request' object
            msg = msg + meta.req.method + " " + meta.req.url;
        }

        // // we no longer need it because it is displayed by the Express 'errorHandler' middleware
        // if(meta.err instanceof Error){
        //     msg = msg + '\n' + meta.err.stack;
        // }
    }

    return winston.config.colorize(options.level) + " " + msg;
}

function getColorStatus(status) {
    let statusColor = "green";
    if (status >= 500) { statusColor = "red"; } else if (status >= 400) { statusColor = "yellow"; } else if (status >= 300) { statusColor = "cyan"; }

    return chalk[statusColor](status);
}

export default logger;
