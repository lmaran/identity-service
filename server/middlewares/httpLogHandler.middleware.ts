// http://stackoverflow.com/a/31296619
// https://github.com/bithavoc/express-winston/blob/master/index.js

// this middleware act as a replacement for Morgan
// Morgan does not let you log req/res body: http://stackoverflow.com/a/30227670

import config from "../config";
import logger from "../logger";
import { getShortReq } from "../helpers";
import { LogSource, LogDetails } from "../constants";
import { Request, Response, NextFunction } from "express";

export const httpLogHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    // ignore "/check" requests
    if (req.originalUrl === "/check") {
        return next();
    }

    // ignore UptimeRobot's requests"
    if (req.headers && req.headers["user-agent"] && (
        req.headers["user-agent"].indexOf("UptimeRobot") !== -1 ||
        req.headers["user-agent"].indexOf("Pingdom.com") !== -1 )) {
        return next();
    }

    const reqLog = config.httpLogDetails.request;
    const resLog = config.httpLogDetails.response;

    // const newRec = getShortReq(req);
    const newRec = {
        method: req.method,
        url: req.url,
    };

    // headers: req.headers,
    // protocol: req.protocol,
    // // originalUrl: req.originalUrl,
    // url: req.url,
    // method: req.method,
    // body: req.body,
    // ctx: req.ctx,
    // ip: req.ip,

    const meta: any = {
        req: {},
        logSource: LogSource.HTTP_LOG_HANDLER,
    };

    if (!reqLog || reqLog.general === LogDetails.EMPTY ) { // NO_REQUEST => skip log
        return next();
    }

    // log request header
    if (reqLog.general === LogDetails.PARTIAL || reqLog.general === LogDetails.FULL) {
       // add Method and Url to req
       meta.req.method = req.method;
       meta.req.url = req.url; // or req.originalUrl
       meta.req.ctx = req.ctx;
    } else if (reqLog >= ReqLog.MIN_HEADER ) {
        meta.req.ip = req.ip;
        // add key headers to req (without cookies, tokens)
        meta.req.headers = {};
        meta.req.headers["user-agent"] = req.headers["user-agent"];
     } else if (reqLog >= ReqLog.FULL_HEADER_NO_BODY ) {
         if (req.headers) {
            meta.req.headers = req.headers;
         }
     } else {
         // add body to req
         if (req.body) {
            meta.req.body = req.body;
         }
     }

    if (!resLog || resLog === ResLog.NO_RESPONSE) { // we don't want to log the response
        logger.info("http logger", meta);
        return next();
    }

    // Add information from the response too, just like Connect.logger does:
    // https://github.com/bithavoc/express-winston/blob/master/index.js
    // req.ctx.startTime = new Date();
    res.locals.startTime = new Date();
    const end = res.end;

    // https://stackoverflow.com/a/48245389
    // res.end = (chunk?: any, encodingOrCb?: string | Function, cb?: Function): void => {
    //     //
    // };

    // res.end = (
    //     chunk?: any,
    //     // tslint:disable-next-line:ban-types
    //     encodingOrCb?: string | Function,
    //     cb?: () => any,
    // ): void => {
    //     //
    // };

    res.end = (chunk, encoding) => {
        const newRes = {
            statusCode: res.statusCode,
            // responseTime: (new Date() as any) - req.ctx.startTime,
            responseTime: (new Date() as any) - res.locals.startTime,
        };

        res.end = end;
        res.end(chunk, encoding);

        meta.res = newRes;

        if (resLog >= ResLog.SIZE_ONLY) {
            // add size and response time
        } else if (resLog >= ResLog.FULL_HEADER_NO_BODY) {
            // add header to res
        } else { // resLog == ResLog.FULL_HEADER_WITH_BODY
            // add body to res
        }

        // ---- Uncomment if you need to log the res.body ----
        //
        // if (chunk) {
        //     var isJson = (res._headers && res._headers['content-type']
        //         && res._headers['content-type'].indexOf('json') >= 0);
        //
        //     newRes.body = isJson ? JSON.parse(chunk) : chunk.toString();
        // }

        logger.info("http logger", meta);
    };
};
