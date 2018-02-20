"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
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
    const newRec = {
        method: req.method,
        url: req.url,
    };
    const meta = {
        req: {},
        logSource: "htmlLogHandler",
    };
    if (!reqLog || reqLog.general === "empty") {
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
    if (reqLog.body === "partial" || reqLog.body === "full") {
        if (req.body) {
            meta.req.body = req.body;
        }
    }
    if (!resLog || allResAreNone(resLog)) {
        return next();
    }
    res.locals.startTime = new Date();
    var end = res.end;
    res.end = function (chunk, encoding) {
        console.log("===================111111111111");
        res.end = end;
        res.end(chunk, encoding);
        meta.res = {
            statusCode: res.statusCode,
            responseTime: new Date() - res.locals.startTime,
        };
        if (resLog.general === "partial" || resLog.general === "full") {
        }
        if (resLog.headers === "partial" || resLog.headers === "full") {
            meta.res.headers = res._headers;
        }
        if (resLog.body === "partial" || resLog.body === "full") {
            if (chunk) {
                const contentType = res.getHeader("content-type");
                const isJson = typeof contentType === "string" && contentType.indexOf("json") >= 0;
                meta.res.body = bodyToString(chunk, isJson);
            }
        }
        console.log(meta);
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
function allResAreNone(resLog) {
    return (!resLog.general || resLog.general === "empty")
        && (!resLog.headers || resLog.headers === "empty")
        && (!resLog.body || resLog.body === "empty");
}
