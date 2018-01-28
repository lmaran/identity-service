// http://odino.org/async-slash-await-in-expressjs/
// https://nemethgergely.com/error-handling-express-async-await/

export const errorHandler = (err, req, res, next) => {
    // var newReq = reqHelper.getShortReq(req);
    // var meta = {req:newReq, err:err};

    // logger.error('error logger', meta);

    // if (config.env === 'development') {
    //     next(err); // returns errors (and stack trace) in the browser
    // } else {
    //     next();
    // }

    // if (err.isServer) { // >=500
    //     // log the error...
    //     // probably you don't want to log unauthorized access
    //     // or do you?
    // }
    // return res.status(err.output.statusCode).json(err.output.payload);

    console.log(err.message);
    res.render("error", { error: err.message });
};
