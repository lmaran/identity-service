// http://stackoverflow.com/a/31296619
// https://github.com/bithavoc/express-winston/blob/master/index.js

// this middleware act as a replacement for Morgan
// Morgan does not let you log req/res body: http://stackoverflow.com/a/30227670

const winston = require("winston"); // for transports.Console
const config = require("../config");
const logger = require("../logger");
import { getShortReq } from "../helpers";

export const httpLogHandler = (err, req, res, next) => {
    req._startTime = new Date();

    // Manage to get information from the response too, just like Connect.logger does:
    const end = res.end;
    res.end = (chunk, encoding) => {
        const newRes = {
            statusCode: res.statusCode,
            responseTime: (new Date() as any) - req._startTime,
        };

        res.end = end;
        res.end(chunk, encoding);

        // ---- Uncomment if you need to log the res.body ----
        //
        // if (chunk) {
        //     var isJson = (res._headers && res._headers['content-type']
        //         && res._headers['content-type'].indexOf('json') >= 0);
        //
        //     newRes.body = isJson ? JSON.parse(chunk) : chunk.toString();
        // }

        const newRec = getShortReq(req);
        const meta = { req: newRec, res: newRes };

        logger.info("http logger", meta);
    };

    next();
};
