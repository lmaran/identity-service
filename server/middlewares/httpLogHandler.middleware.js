"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const helpers_1 = require("../helpers");
exports.httpLogHandler = (req, res, next) => {
    console.log("Start httpLogHandler...");
    req._startTime = new Date();
    const newRec = helpers_1.getShortReq(req);
    const meta = {
        req: newRec,
        logSource: "htmlLogHandler",
    };
    logger_1.default.info("http logger", meta);
    next();
};
