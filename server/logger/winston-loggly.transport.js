"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const loggly = require("node-loggly-bulk");
const winston = require("winston");
const winston2rollbar_levels = {
    debug: "debug",
    verbose: "info",
    info: "info",
    warn: "warning",
    error: "error",
};
const Transport = exports.Loggly = function (options) {
    options = options || {};
    winston.Transport.call(this, options);
    if (!options.subdomain) {
        throw new Error("Loggly Subdomain is required");
    }
    else if (!options || !options.token) {
        throw new Error("Loggly Customer token is required.");
    }
    this.name = "loggly";
    this.loggly = loggly.createClient({
        token: options.token,
        subdomain: options.subdomain,
        tags: options.tags,
        json: options.json,
        bufferOptions: options.bufferOptions,
    });
    this.timestamp = options.timestamp === false ? false : true;
};
util.inherits(Transport, winston.Transport);
winston.transports.Loggly = Transport;
Transport.prototype.log = function (level, msg, meta, callback) {
    const message = winston.clone(meta || {});
    message.level = level;
    message.message = msg || message.message;
    this.loggly.log(message, meta.tags, err => {
        if (err) {
            return callback(err);
        }
        callback(null, true);
    });
};
