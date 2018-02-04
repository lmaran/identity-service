"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catch404 = (req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
};
