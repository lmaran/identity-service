// http://odino.org/async-slash-await-in-expressjs/
// https://nemethgergely.com/error-handling-express-async-await/
// http://thecodebarbarian.com/80-20-guide-to-express-error-handling
// https://github.com/rollbar/node_rollbar/blob/master/lib/error.js

// all these errors are finally caught by an errorHandler middleware

// To catch all errors we can:
// 1. run each route handler within a try/catch
// app.get('/users', async function(req, res, next){
//     try {
//          res.json(await db.getUsers())
//     } catch(err) {
//          next(err)
//     }
// })

// 2. use a wrapper in order to call each event handler
// const asyncMiddleware = fn =>
//      (req, res, next) => {
//          Promise.resolve(fn(req, res, next))
//              .catch(err => next(err)) ;
//      };

// app.get('/users', asyncMiddleware(async function(req, res, next){
//      res.json(await db.getUsers())
// }))

import { Request, Response, NextFunction } from "express";
import { ReturnType, LogSource } from "../constants";
import { ApplicationError } from "../errors/application.error";
import { urlHelper } from "../helpers";
import config from "../config";
import { EnvironmentType } from "../constants";
import logger from "../logger";
import { PageNotFound, ValidationError } from "../errors";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let meta: any;
    let returnType: ReturnType;

    if (err instanceof ApplicationError) {
        res.status(err.status);

        meta = {
            requestId: req.ctx.requestId,
            developerMessage: err.developerMessage,
            errorType: err.name,
            logSource: LogSource.ERROR_HANDLER,
            stack: err instanceof PageNotFound ? undefined : err.stack,
        };

        logger.info(err.message, meta);

        returnType = getReturnType(req, err);

        if (returnType === ReturnType.REDIRECT) {
            const urlParsed = urlHelper.buildUrl(err.redirectUri, {
                error: err.message,
            }, null);
            return res.redirect(urlParsed);
        }

        if (returnType === ReturnType.HTML) {
            return res.render("error", { error: err.message });
        }

        if (returnType === ReturnType.JSON) {
            return res.json({ error: err.message });
        }

        // default to plain-text
        return res.type("txt").send(err.message);

    }

    if (err instanceof Error) {
        res.status(500);

        meta = {
            requestId: req.ctx && req.ctx.requestId,
            errorType: err.name,
            logSource: LogSource.ERROR_HANDLER,
            stack: err.stack,
        };

        logger.error(err.message, meta);

        returnType = getReturnType(req);

        if (returnType === ReturnType.HTML) {
            return res.render("error", { error: err.message });
        }

        if (returnType === ReturnType.JSON) {
            return res.json({ error: err.message });
        }

        // default to plain-text
        return res.type("txt").send(err.message);

    }

    // so err is not an Error instance:
    meta = {
        requestId: req.ctx.requestId,
        errorType: "UnknownError",
        logSource: LogSource.ERROR_HANDLER,
    };

    const err2 = { message: err || "Eroare necunoscuta"};

    logger.error(err2.message, meta);

    returnType = getReturnType(req);

    if (returnType === ReturnType.HTML) {
        return res.render("error", { error: err2.message });
    }

    if (returnType === ReturnType.JSON) {
        return res.json({ error: err2.message });
    }

    // default to plain-text
    return res.type("txt").send(err.message);
};

function getReturnType(req: Request, err?: ApplicationError): ReturnType {
    if (err && err.returnAs) {
        return err.returnAs;
    } else {
        if (req.accepts("html")) {
            return ReturnType.HTML;
        } else if (req.accepts("json")) {
            return ReturnType.JSON;
        } else {
            return ReturnType.TEXT;
        }
    }
}
