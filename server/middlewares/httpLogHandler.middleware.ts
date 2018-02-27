// http://stackoverflow.com/a/31296619
// https://github.com/bithavoc/express-winston/blob/master/index.js

// this middleware act as a replacement for Morgan
// Morgan does not let you log req/res body: http://stackoverflow.com/a/30227670

import config from "../config";
import logger from "../logger";
import { LogSource, LogDetail } from "../constants";
import { Request, Response, NextFunction } from "express";

export const httpLogHandler = (req: Request, res: Response, next: NextFunction) => {
    // ignore "/check" requests
    if (req.originalUrl === "/check") {
        return next();
    }

    // ignore UptimeRobot's requests"
    const ua = req.headers && req.headers["user-agent"];
    if (ua && (
            ua.indexOf("UptimeRobot") !== -1 ||
            ua.indexOf("Pingdom.com") !== -1)
        ) {
        return next();
    }

    const reqLog = (config.httpLogDetails && config.httpLogDetails.request) || {};
    const resLog = (config.httpLogDetails && config.httpLogDetails.response) || {};

    const meta: any = {
        logSource: LogSource.HTTP_LOG_HANDLER,
        req: {},
    };

    if (!reqLog || reqLog.general === LogDetail.NONE) { // NO_REQUEST => skip log
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
    // if response in cached by browser (304) => there will be no body (and fewer req. headers)
    if (reqLog.body) {
        if (req.body) {
            meta.req.body = req.body;
        }
    }

    if (!resLog || !resLog.general) { // NO_RESPONSE => log Request and exit
        logger.info("http-logger", meta);
        return next();
    }

    // Add information from the response too, just like Connect.logger does:
    // https://github.com/bithavoc/express-winston/blob/master/index.js
    res.locals.startTime = new Date();
    const end = res.end;

    // https://stackoverflow.com/a/48245389
    // tslint:disable-next-line:ban-types
    res.end = (chunk?: any, encoding?: string | Function): void => {
        res.end = end;
        res.end(chunk, (encoding as string));

        meta.res = {
            statusCode: res.statusCode,
            responseTime: (new Date() as any) - res.locals.startTime,
        };

        if (resLog.headers) {
            // there are 2 headers that will not appear here:
            // 1. Date: "server date"
            // 2. Connection: "keep-alive"
            // there is an npm package that extracts these 2 headers too but it doesn't make sens to use it just for that
            // npm: https://github.com/watson/http-headers
            meta.res.headers = (res as any)._headers;
        }

        if (resLog.body && chunk) {
            const contentType = res.getHeader("content-type");
            const isJson = typeof contentType === "string" && contentType.indexOf("json") >= 0;
            meta.res.body = bodyToString(chunk, isJson);
        }

        logger.info("http-logger", meta);
    };
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
