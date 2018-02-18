// http://stackoverflow.com/a/31296619
// https://github.com/bithavoc/express-winston/blob/master/index.js

// this middleware act as a replacement for Morgan
// Morgan does not let you log req/res body: http://stackoverflow.com/a/30227670

import config from "../config";
import logger from "../logger";
import { getShortReq } from "../helpers";
import { LogSource } from "../constants";

export const httpLogHandler = (req, res, next) => {
    console.log("Start httpLogHandler...");
    req._startTime = new Date();

    const newRec = getShortReq(req);
    const meta: any = {
        req: newRec,
        logSource: LogSource.HTTP_LOG_HANDLER,
    };

    // // only for LOG_LEVEL=DEBUG
    // // Manage to get information from the response too, just like Connect.logger does:
    // const end = res.end;
    // res.end = (chunk, encoding) => {
    //     const newRes = {
    //         statusCode: res.statusCode,
    //         responseTime: (new Date() as any) - req._startTime,
    //     };

    //     res.end = end;
    //     res.end(chunk, encoding);

    //     // ---- Uncomment if you need to log the res.body ----
    //     //
    //     // if (chunk) {
    //     //     var isJson = (res._headers && res._headers['content-type']
    //     //         && res._headers['content-type'].indexOf('json') >= 0);
    //     //
    //     //     newRes.body = isJson ? JSON.parse(chunk) : chunk.toString();
    //     // }

    //     meta.res = newRes;
    // };

    logger.info("http logger", meta);
    next();
};
