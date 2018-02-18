// https://github.com/loggly/winston-loggly-bulk/blob/master/lib/winston-loggly.js

import * as util from "util";
import * as loggly from "node-loggly-bulk";
// import * as winston from "winston"; // we get a ts error with "import"
const winston = require("winston");
import config from "../config";

const winston2rollbar_levels = {
    debug: "debug",
    verbose: "info",
    info: "info",
    warn: "warning",
    error: "error",
};

// tslint:disable-next-line:variable-name
const Transport = exports.Loggly = function(options) {
    options = options || {};

    winston.Transport.call(this, options);

    if (!options.subdomain) {
        throw new Error("Loggly Subdomain is required");
    } else if (!options || !options.token) {
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

/** extends winston.Transport */
util.inherits(Transport, winston.Transport);

/** Define a getter so that `winston.transports.Rollbar` is available and thus backwards compatible. */
winston.transports.Loggly = Transport;

// example:
// log.info(msg, meta) where:
//     meta = {
//         request: {},
//         err: {},
//         custom: {},
//     }
Transport.prototype.log = function(level, msg, meta, callback) {
    // if (this.timestamp && (!meta || !meta.timestamp)) {
    //     meta = meta || {};
    //     meta.timestamp = (new Date()).toISOString();
    // }

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
