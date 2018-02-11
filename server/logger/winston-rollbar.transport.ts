// https://github.com/hipyhop/winston-rollbar/blob/master/lib/winston-rollbar.js
// deprecated rollbar (v0.6.x): https://github.com/rollbar/node_rollbar
// new rollbar (v2.3.x): https://github.com/rollbar/rollbar.js

import * as util from "util";
import * as Rollbar from "rollbar"; // a constructor is imported instead of a singleton
import * as winston from "winston";
import config from "../config";

const winston2rollbar_levels = {
    debug: "debug",
    verbose: "info",
    info: "info",
    warn: "warning",
    error: "error",
};

// tslint:disable-next-line:variable-name
const Transport = exports.Rollbar = function(options) {
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
    this.silent = options.silent || false; // Disable rollbar reporting
};

/** extends winston.Transport */
util.inherits(Transport, winston.Transport);

/** Define a getter so that `winston.transports.Rollbar` is available and thus backwards compatible. */
winston.transports.Rollbar = Transport;

Transport.prototype.log = function(level, msg, meta, callback) {
    if (this.silent) {
        return callback(null, true);
    }

    const lvl = winston2rollbar_levels[level];
    if (!lvl) {
        // Skipping due to no level found.
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
