"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const config = require("../config/environment");
const logger = require("./logger");
const helpers_1 = require("../helpers");
exports.httpLogHandler = (err, req, res, next) => {
    req._startTime = new Date();
    const end = res.end;
    res.end = (chunk, encoding) => {
        const newRes = {
            statusCode: res.statusCode,
            responseTime: new Date() - req._startTime,
        };
        res.end = end;
        res.end(chunk, encoding);
        const newRec = helpers_1.getShortReq(req);
        const meta = { req: newRec, res: newRes };
        logger.info("http logger", meta);
    };
    next();
};
