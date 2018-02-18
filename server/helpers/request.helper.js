"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShortReq = (req) => {
    const newReq = {
        headers: req.headers,
        protocol: req.protocol,
        originalUrl: req.originalUrl,
        url: req.url,
        method: req.method,
        body: req.body,
        ctx: req.ctx,
        ip: req.ip,
    };
    return newReq;
};
module.exports.getShortReq = exports.getShortReq;
