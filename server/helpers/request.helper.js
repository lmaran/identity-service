"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShortReq = (req) => {
    const newReq = {
        headers: req.headers,
        protocol: req.protocol,
        url: req.originalUrl || req.url,
        method: req.method,
        body: req.body,
        route: req.route,
        ip: getIp(req),
    };
    return newReq;
};
const getIp = (req) => {
    const ip = req.ip
        || (req.connection && req.connection.remoteAddress)
        || undefined;
    if (ip) {
        const parts = ip.split(":");
        return parts[parts.length - 1];
    }
    else {
        return "";
    }
};
module.exports.getShortReq = exports.getShortReq;
