"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const chalk = require("chalk");
exports.formatterFunc = options => {
    const meta = options.meta;
    const message = options.message;
    let msg = "";
    if (meta.logSource === "htmlLogHandler") {
        if (meta.req) {
            msg = msg + meta.req.method + " " + meta.req.url;
            if (meta.res) {
                msg = msg + " " + getColorStatus(meta.res.statusCode) + " - " + meta.res.responseTime + " ms ";
            }
        }
        msg = msg + "\n" + JSON.stringify(meta, null, 4);
    }
    else if (meta.logSource === "errorHandler") {
        msg = msg + (undefined !== message ? message : "");
        if (meta && Object.keys(meta).length > 0) {
            const stack = meta.stack;
            if (stack) {
                delete meta.stack;
            }
            msg = msg + "\n" + JSON.stringify(meta, null, 4);
            if (stack) {
                msg = msg + "\n" + stack;
            }
        }
    }
    else {
        msg = msg + (undefined !== message ? message : "");
        if (meta && Object.keys(meta).length > 0) {
            const stack = meta.stack;
            if (stack) {
                delete meta.stack;
            }
            msg = msg + "\n" + JSON.stringify(meta, null, 4);
            if (stack) {
                msg = msg + "\n" + stack;
            }
        }
    }
    return winston.config.colorize(options.level) + " " + msg;
};
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
