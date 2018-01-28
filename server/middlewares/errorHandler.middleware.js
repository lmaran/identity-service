"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = (err, req, res, next) => {
    console.log(err.message);
    res.render("error", { error: err.message });
};
