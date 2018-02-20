"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const logger_1 = require("../logger");
exports.httpLogHandler = (req, res, next) => {
    if (req.originalUrl === "/check") {
        return next();
    }
    if (req.headers && req.headers["user-agent"] && (req.headers["user-agent"].indexOf("UptimeRobot") !== -1 ||
        req.headers["user-agent"].indexOf("Pingdom.com") !== -1)) {
        return next();
    }
    const reqLog = (config_1.default.httpLogDetails && config_1.default.httpLogDetails.request) || {};
    const resLog = (config_1.default.httpLogDetails && config_1.default.httpLogDetails.response) || {};
    const meta = {
        logSource: "htmlLogHandler",
        req: {},
    };
    if (!reqLog || reqLog.general === "none") {
        return next();
    }
    if (reqLog.general === "partial") {
        meta.req.method = req.method;
        meta.req.url = req.url;
    }
    else if (reqLog.general === "full") {
        meta.req.method = req.method;
        meta.req.url = req.url;
        meta.req.ip = req.ip;
        meta.req.ctx = req.ctx;
    }
    if (reqLog.headers === "partial") {
        meta.req.headers = {};
        meta.req.headers["user-agent"] = req.headers["user-agent"];
    }
    else if (reqLog.headers === "full") {
        meta.req.headers = req.headers;
    }
    if (reqLog.body) {
        if (req.body) {
            meta.req.body = req.body;
        }
    }
    if (!resLog || !resLog.general) {
        logger_1.default.info("http-logger", meta);
        return next();
    }
    res.locals.startTime = new Date();
    const end = res.end;
    res.end = (chunk, encoding) => {
        res.end = end;
        res.end(chunk, encoding);
        meta.res = {
            statusCode: res.statusCode,
            responseTime: new Date() - res.locals.startTime,
        };
        if (resLog.headers) {
            meta.res.headers = res._headers;
        }
        if (resLog.body && chunk) {
            const contentType = res.getHeader("content-type");
            const isJson = typeof contentType === "string" && contentType.indexOf("json") >= 0;
            meta.res.body = bodyToString(chunk, isJson);
        }
        logger_1.default.info("http-logger", meta);
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
    }
    catch (e) {
        return undefined;
    }
}
