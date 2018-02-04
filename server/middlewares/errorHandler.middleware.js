"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const config_1 = require("../config");
exports.errorHandler = (err, req, res, next) => {
    err.requestId = req.requestId;
    console.log(err.message);
    if (err.errorOptions && err.errorOptions.returnAs === "redirect") {
        const urlParsed = helpers_1.urlHelper.buildUrl(err.errorOptions.redirectUri, {
            error: err.message,
        }, null);
        return res.redirect(urlParsed);
    }
    const error = {
        error: {
            message: err.message,
            details: (config_1.default.env === "development" && err.errorOptions) ? err.errorOptions.developerMessage : null,
            stack: (config_1.default.env === "development") ? err.stack : null,
            requestId: err.requestId,
        },
    };
    res.status(err.status || 500);
    if (err.errorOptions && err.errorOptions.returnAs === "render") {
        return res.status(err.status).render("error", { error: err.message });
    }
    else {
        return res.status(err.status).json(err);
    }
};
