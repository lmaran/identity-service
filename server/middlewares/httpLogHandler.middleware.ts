// http://stackoverflow.com/a/31296619
// https://github.com/bithavoc/express-winston/blob/master/index.js

// this middleware act as a replacement for Morgan
// Morgan does not let you log req/res body: http://stackoverflow.com/a/30227670

import config from "../config";
import logger from "../logger";
import { getShortReq } from "../helpers";
import { LogSource, LogDetail } from "../constants";
import { Request, Response, NextFunction } from "express";

export const httpLogHandler = (req: Request, res: any, next: NextFunction) => {

    // ignore "/check" requests
    if (req.originalUrl === "/check") {
        return next();
    }

    // ignore UptimeRobot's requests"
    if (req.headers && req.headers["user-agent"] && (
        req.headers["user-agent"].indexOf("UptimeRobot") !== -1 ||
        req.headers["user-agent"].indexOf("Pingdom.com") !== -1)) {
        return next();
    }

    const reqLog = (config.httpLogDetails && config.httpLogDetails.request) || {};
    const resLog = (config.httpLogDetails && config.httpLogDetails.response) || {};

    // const newRec = getShortReq(req);
    const newRec = {
        method: req.method,
        url: req.url,
    };

    const meta: any = {
        req: {},
        logSource: LogSource.HTTP_LOG_HANDLER,
    };

    if (!reqLog || reqLog.general === LogDetail.EMPTY) { // NO_REQUEST => skip log
        return next();
    }

    // Set Request General
    if (reqLog.general === LogDetail.PARTIAL) {
        meta.req.method = req.method;
        meta.req.url = req.url; // or req.originalUrl
    } else if (reqLog.general === LogDetail.FULL) {
        meta.req.method = req.method;
        meta.req.url = req.url; // or req.originalUrl
        meta.req.ip = req.ip;
        meta.req.ctx = req.ctx;
    }

    // Set Request Headers
    if (reqLog.headers === LogDetail.PARTIAL) {
        meta.req.headers = {};
        meta.req.headers["user-agent"] = req.headers["user-agent"];
    } else if (reqLog.headers === LogDetail.FULL) {
        meta.req.headers = req.headers;
    }

    // Set Request Body
    if (reqLog.body === LogDetail.PARTIAL || reqLog.body === LogDetail.FULL) {
        if (req.body) {
            meta.req.body = req.body;
        }
    }

    // Log Request and exit (if we don't want to log the response)
    if (!resLog || allResAreNone(resLog)) {
        // console.log(meta);
        // logger.info("http logger", meta);
        return next();
    }

    // Add information from the response too, just like Connect.logger does:
    // https://github.com/bithavoc/express-winston/blob/master/index.js
    // req.ctx.startTime = new Date();
    res.locals.startTime = new Date();

    // tslint:disable-next-line:prefer-const no-var-keyword
    var end = res.end;

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

    // tslint:disable-next-line:ban-types
    // tslint:disable-next-line:only-arrow-functions
    res.end = function(chunk, encoding) {
        console.log("===================111111111111");
        res.end = end;
        res.end(chunk, encoding);
        meta.res = {
            statusCode: res.statusCode,
            // // responseTime: (new Date() as any) - req.ctx.startTime,
            responseTime: (new Date() as any) - res.locals.startTime,
        };

        // Set Response Headers
        if (resLog.general === LogDetail.PARTIAL || resLog.general === LogDetail.FULL) {
            // add
        }

        if (resLog.headers === LogDetail.PARTIAL || resLog.headers === LogDetail.FULL) {
            meta.res.headers = res._headers;
        }

        if (resLog.body === LogDetail.PARTIAL || resLog.body === LogDetail.FULL) {
            // res.end = end;
            // res.end(chunk, encoding as string);

            // if (resLog >= ResLog.SIZE_ONLY) {
            //     // add size and response time
            // } else if (resLog >= ResLog.FULL_HEADER_NO_BODY) {
            //     // add header to res
            // } else { // resLog == ResLog.FULL_HEADER_WITH_BODY
            //     // add body to res
            // }

            // ---- Uncomment if you need to log the res.body ----

            if (chunk) {
                // const isJson = (res._headers && res._headers["content-type"]
                //     && res._headers['content-type'].indexOf('json') >= 0);
                const contentType = res.getHeader("content-type");
                // console.log("CT: " + contentType);
                // console.log(res._headers);
                const isJson = typeof contentType === "string" && contentType.indexOf("json") >= 0;

                meta.res.body = bodyToString(chunk, isJson);
            }
        }

        // console.log("===================");
        console.log(meta);

        // const httpHeaders = require("http-headers");
        // console.log(httpHeaders(res));

        // logger.info("http logger", meta);
        // return next();
    };

    // console.log("===================");
    // console.log(123);
    return next();
};

function bodyToString(body, isJSON) {
    const stringBody = body && body.toString();
    if (isJSON) {
        return (safeJSONParse(body) || stringBody);
    }
    return stringBody;
}

function safeJSONParse(string) {
    try {
        return JSON.parse(string);
    } catch (e) {
        return undefined;
    }
}

function allResAreNone(resLog) {
    return (!resLog.general || resLog.general === LogDetail.EMPTY)
    && (!resLog.headers || resLog.headers === LogDetail.EMPTY)
    && (!resLog.body || resLog.body === LogDetail.EMPTY);
}
