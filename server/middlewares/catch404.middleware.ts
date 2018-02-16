// catch 404 and forward to error handler
export const catch404 = (req, res, next) => {
    // const err: any = new Error("Not Found");
    // err.status = 404;
    // next(err);

    console.log("Start catch404...");
    next();
};
