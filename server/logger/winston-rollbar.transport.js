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
    if (!options.rollbarAccessToken) {
        throw new Error("winston-transport-rollbar requires a 'rollbarAccessToken' property");
    }
    const opts = { accessToken: options.rollbarAccessToken };
    if (options.rollbarConfig) {
        Object.assign(opts, options.rollbarConfig);
    }
    this.rollbar = new Rollbar(opts);
    this.name = "rollbar";
    this.level = options.level || "warn";
    this.silent = options.silent || false;
};
util.inherits(Transport, winston.Transport);
winston.transports.Rollbar = Transport;
Transport.prototype.log = function (level, msg, meta, callback) {
    if (this.silent) {
        return callback(null, true);
    }
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
