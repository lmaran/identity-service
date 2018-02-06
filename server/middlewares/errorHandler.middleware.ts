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

// export const errorHandler = (err, req, res, next) => {
//     // var newReq = reqHelper.getShortReq(req);
//     // var meta = {req:newReq, err:err};

//     // logger.error('error logger', meta);

//     // if (config.env === 'development') {
//     //     next(err); // returns errors (and stack trace) in the browser
//     // } else {
//     //     next();
//     // }

//     // if (err.isServer) { // >=500
//     //     // log the error...
//     //     // probably you don't want to log unauthorized access
//     //     // or do you?
//     // }
//     // return res.status(err.output.statusCode).json(err.output.payload);

//     console.log(err.message);
//     res.render("error", { error: err.message });
// };

// // express-generator error handler
// app.use((err, req, res, next) => {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get("env") === "development" ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render("error");
// });

import { ReturnType, OAuthAuthorizationError } from "../constants";
import { ApplicationError } from "../errors/application.error";
import { urlHelper } from "../helpers";
import config from "../config";
import { EnvironmentType } from "../constants";

export const errorHandler = (err: ApplicationError, req, res, next) => {

    // 1. format the error
    // err.requestId = req.requestId;

    // 2. log the error (all details)
    console.log(err.message);

    if (err.returnAs === ReturnType.REDIRECT) {
        const urlParsed = urlHelper.buildUrl(err.redirectUri, {
            error: err.message,
        }, null);
        return res.redirect(urlParsed);
    }

    // 4. return the error to the user (without sensitive details)

    // 3. remove sensitive details for non-dev environments
    // if (config.env === "development") {
    //     err.stack = null;
    //     err.details = null;
    // }

    const error = {
        error: {
            // code: err.code,
            message: err.message,
            details: (config.env === EnvironmentType.DEVELOPMENT) ? err.developerMessage : null,
            stack: (config.env === EnvironmentType.DEVELOPMENT) ? err.stack : null,
            requestId: req.requestId,
            // helpUrl: "http://.../err.helpUrl",
            // validationErrors: err.validationErrors
        },
    };

    res.status(err.status || 500);

    if (err.returnAs === ReturnType.RENDER) {
        return res.status(err.status).render("error", { error: err.message });
    } else { // err.returnAs === returnType.JSON
        return res.status(err.status).json(err);
    }
    // return res.render("error", { error: err.message });
};
