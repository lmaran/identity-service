import { Request, Response, NextFunction } from "express";

export const getShortReq = (req: Request) => {
    // keep in mind that some request fields could be updated later, by code: E.g.:
    //      "body" - as in 'orderController'
    //      "user" - added by Passport
    // so, use a clone of them if you want to keep the original

    // available fields: https://github.com/rollbar/node_rollbar#the-request-object
    const newReq = {
        headers: req.headers,
        protocol: req.protocol,
        originalUrl: req.originalUrl,
        url: req.url,
        method: req.method,
        body: req.body,
        // route: req.route,
        ctx: req.ctx,
        // ip: getIp(req),
        ip: req.ip,
    };

    // if (req.user) {
    //     // available fields: https://github.com/rollbar/node_rollbar#person-tracking
    //     newReq.user = {
    //         id: req.user._id,
    //         username: req.user.name,
    //         email: req.user.email,
    //     };
    // }

    return newReq;
};

module.exports.getShortReq = getShortReq;
