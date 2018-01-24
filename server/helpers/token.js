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
const nosql2 = require("nosql");
const nosql = nosql2.load("database.nosql");
const token_service_1 = require("../components/token/token.service");
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
    console.log("Incoming token: %s", inToken);
    const token = yield token_service_1.default.getAccessToken(inToken);
    if (token) {
        console.log("We found a matching token: %s", inToken);
    }
    else {
        console.log("No matching token was found.");
    }
    req.access_token = token;
    next();
    return;
});
exports.requireAccessToken = (req, res, next) => {
    if (req.access_token) {
        next();
    }
    else {
        res.status(401).end();
    }
};
