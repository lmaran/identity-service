// catch 404 and forward to error handler
import { PageNotFound } from "../errors";

export const catch404 = (req, res, next) => {
    const err = new PageNotFound(`Pagina negasita: ${req.method} ${req.url}`);
    next(err);
};
