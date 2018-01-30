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

// export const errorLogHandler = (err, req, res, next) => {
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

// tslint:disable-next-line:variable-name
const Rollbar = require("rollbar");
// import * as Rollbar from "rollbar";
import config from "../config";
const rollbar = new Rollbar({
    accessToken: config.rollbarToken,
    environment: config.env,
});

export const errorLogHandler = rollbar.errorHandler();
