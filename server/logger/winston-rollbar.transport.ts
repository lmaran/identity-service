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
    if (!options.accessToken) {
        throw new Error("winston-transport-rollbar requires an 'accessToken' property");
    }

    this.rollbar = new Rollbar(options);
    this.name = "rollbar";
};

/** extends winston.Transport */
util.inherits(Transport, winston.Transport);

/** Define a getter so that `winston.transports.Rollbar` is available and thus backwards compatible. */
winston.transports.Rollbar = Transport;

// example:
// log.info(msg, meta) where:
//     meta = {
//         request: {},
//         err: {},
//         custom: {},
//     }
Transport.prototype.log = function(level, msg, meta, callback) {
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
