"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const config_1 = require("../config");
exports.errorHandler = (err, req, res, next) => {
    console.log(err.message);
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
            requestId: req.requestId,
        },
    };
    res.status(err.status || 500);
    if (err.returnAs === "render") {
        return res.status(err.status).render("error", { error: err.message });
    }
    else {
        return res.status(err.status).json(err);
    }
};
