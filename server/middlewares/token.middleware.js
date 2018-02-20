"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const logger_1 = require("../logger");
exports.getAccessToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const auth = req.headers.authorization;
    let inToken;
    if (auth && auth.toLowerCase().indexOf("bearer") === 0) {
        inToken = auth.slice("bearer ".length);
    }
    else if (req.body && req.body.access_token) {
        inToken = req.body.access_token;
    }
    else if (req.query && req.query.access_token) {
        inToken = req.query.access_token;
    }
    logger_1.default.debug("Incoming token: %s", inToken);
    const token = yield services_1.tokenService.getAccessToken(inToken);
    if (token) {
        logger_1.default.debug("We found a matching token: %s", inToken);
    }
    else {
        logger_1.default.debug("No matching token was found.");
    }
    req.ctx.accessToken = token;
    next();
    return;
});
exports.requireAccessToken = (req, res, next) => {
    if (req.ctx.accessToken) {
        next();
    }
    else {
        res.status(401).end();
    }
};
