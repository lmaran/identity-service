"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
exports.catch404 = (req, res, next) => {
    const err = new errors_1.PageNotFound(`Pagina negasita: ${req.method} ${req.url}`);
    next(err);
};
