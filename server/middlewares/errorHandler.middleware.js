"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_error_1 = require("../errors/application.error");
const helpers_1 = require("../helpers");
const logger_1 = require("../logger");
const errors_1 = require("../errors");
exports.errorHandler = (err, req, res, next) => {
    let meta;
    let returnType;
    if (err instanceof application_error_1.ApplicationError) {
        res.status(err.status);
        meta = {
            requestId: req.ctx.requestId,
            developerMessage: err.developerMessage,
            errorType: err.name,
            logSource: "errorHandler",
            stack: err instanceof errors_1.PageNotFound ? undefined : err.stack,
        };
        logger_1.default.info(err.message, meta);
        returnType = getReturnType(req, err);
        if (returnType === "redirect") {
            const urlParsed = helpers_1.urlHelper.buildUrl(err.redirectUri, {
                error: err.message,
            }, null);
            return res.redirect(urlParsed);
        }
        if (returnType === "html") {
            return res.render("error", { error: err.message });
        }
        if (returnType === "json") {
            return res.json({ error: err.message });
        }
        return res.type("txt").send(err.message);
    }
    if (err instanceof Error) {
        res.status(500);
        meta = {
            requestId: req.ctx && req.ctx.requestId,
            errorType: err.name,
            logSource: "errorHandler",
            stack: err.stack,
        };
        logger_1.default.error(err.message, meta);
        returnType = getReturnType(req);
        if (returnType === "html") {
            return res.render("error", { error: err.message });
        }
        if (returnType === "json") {
            return res.json({ error: err.message });
        }
        return res.type("txt").send(err.message);
    }
    meta = {
        requestId: req.ctx.requestId,
        errorType: "UnknownError",
        logSource: "errorHandler",
    };
    const err2 = { message: err || "Eroare necunoscuta" };
    logger_1.default.error(err2.message, meta);
    returnType = getReturnType(req);
    if (returnType === "html") {
        return res.render("error", { error: err2.message });
    }
    if (returnType === "json") {
        return res.json({ error: err2.message });
    }
    return res.type("txt").send(err.message);
};
function getReturnType(req, err) {
    if (err && err.returnAs) {
        return err.returnAs;
    }
    else {
        if (req.accepts("html")) {
            return "html";
        }
        else if (req.accepts("json")) {
            return "json";
        }
        else {
            return "text";
        }
    }
}
