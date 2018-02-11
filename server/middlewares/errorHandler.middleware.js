"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const config_1 = require("../config");
const logger_1 = require("../logger");
exports.errorHandler = (err, req, res, next) => {
    if (err.returnAs === "redirect") {
        const urlParsed = helpers_1.urlHelper.buildUrl(err.redirectUri, {
            error: err.message,
        }, null);
        return res.redirect(urlParsed);
    }
    const error = {
        error: {
            message: err.message,
            details: (config_1.default.env === "development") ? err.developerMessage : null,
            stack: (config_1.default.env === "development") ? err.stack : null,
            requestId: req.ctx.requestId,
        },
    };
    res.status(err.status || 500);
    const meta = {
        err: {
            message: err.message,
            stack: (config_1.default.env === "development") ? err.stack : null,
            requestId: req.ctx.requestId,
        },
        req: { aa: 11 },
        res: { bb: 22 },
    };
    logger_1.default.error(err.message, meta);
    if (err.returnAs === "render") {
        return res.status(err.status || 500).render("error", { error: err.message });
    }
    else {
        return res.status(err.status || 500).json(err);
    }
};
