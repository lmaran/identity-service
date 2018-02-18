"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const Rollbar = require("rollbar");
const winston = require("winston");
const winston2rollbar_levels = {
    debug: "debug",
    verbose: "info",
    info: "info",
    warn: "warning",
    error: "error",
};
const Transport = exports.Rollbar = function (options) {
    options = options || {};
    if (!options.accessToken) {
        throw new Error("winston-transport-rollbar requires an 'accessToken' property");
    }
    this.rollbar = new Rollbar(options);
    this.name = "rollbar";
};
util.inherits(Transport, winston.Transport);
winston.transports.Rollbar = Transport;
Transport.prototype.log = function (level, msg, meta, callback) {
    const lvl = winston2rollbar_levels[level];
    if (!lvl) {
        winston.info("No rollbar level found for winston report level %s", level);
        return callback(null, true);
    }
    if (!meta) {
        meta = {};
    }
    if (typeof meta === "string") {
        meta = { message: meta };
    }
    let req;
    if (meta.request) {
        req = meta.request;
        delete meta.request;
    }
    let error;
    if (meta.err) {
        error = meta.err;
        delete meta.err;
    }
    this.rollbar.configure({ logLevel: lvl });
    this.rollbar.log(msg, req, error, meta, err => {
        if (err) {
            return callback(err);
        }
        callback(null, true);
    });
};
