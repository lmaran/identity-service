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
const _ = require("lodash");
const randomstring = require("randomstring");
const crypto = require("crypto");
const data_1 = require("../data");
const services_1 = require("../services");
const helpers_1 = require("../helpers");
const err = require("../errors");
exports.approveController = {
    approve: (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const requestId = req.body.requestId;
            const request = yield data_1.requestData.get(requestId);
            const query = request.query;
            data_1.requestData.delete(requestId);
            let urlParsed;
            if (!query) {
                throw new err.ValidationError("No matching authorization request", {
                    developerMessage: `There was no matching saved request`,
                    returnAs: "render",
                });
            }
            if (!req.body.approve) {
                throw new err.ValidationError("access_denied", {
                    developerMessage: `"req.body.approve" is falsy`,
                    returnAs: "redirect",
                    redirectUri: query.redirect_uri,
                });
            }
            if (query.response_type !== "code") {
                throw new err.ValidationError("unsupported_response_type", {
                    developerMessage: `query.response_type !== "code"`,
                    returnAs: "redirect",
                    redirectUri: query.redirect_uri,
                });
            }
            const tenantCode = req.tenantCode;
            if (!tenantCode) {
                throw new err.ValidationError("Missing tenant", {
                    developerMessage: `There was no tenant code`,
                    returnAs: "render",
                });
            }
            const code = randomstring.generate(8);
            const user = yield services_1.userService.getUserByEmail(req.body.email, tenantCode);
            if (!user) {
                throw new err.ValidationError(`User not found`, {
                    developerMessage: `user is falsy`,
                    returnAs: "redirect",
                    redirectUri: query.redirect_uri,
                });
            }
            const persistedPassword = {
                salt: user.salt,
                hashedPassword: user.hashedPassword,
            };
            const pswMatch = helpers_1.passwordHelper.passwordMatch(persistedPassword, req.body.password);
            if (!pswMatch) {
                throw new err.ValidationError(`Incorrect password`, {
                    developerMessage: `Passwords not match`,
                    returnAs: "redirect",
                    redirectUri: query.redirect_uri,
                });
            }
            const scopes = getScopesFromForm(req.body);
            const client = yield services_1.clientService.getByCode(query.client_id, tenantCode);
            const cscope = client.scope ? client.scope.split(" ") : [];
            if (_.difference(scopes, cscope).length > 0) {
                throw new err.ValidationError("invalid_scope", {
                    developerMessage: `Client asked for a scope it couldn't have`,
                    returnAs: "redirect",
                    redirectUri: query.redirect_uri,
                });
            }
            data_1.codeData.create({ code, request: query, scope: scopes, user });
            urlParsed = helpers_1.urlHelper.buildUrl(query.redirect_uri, {
                code,
                state: query.state,
            }, null);
            res.redirect(urlParsed);
            return;
        }
        catch (err) {
            next(err);
        }
    }),
};
const getScopesFromForm = body => {
    return _.filter(_.keys(body), s => _.startsWith(s, "scope_"))
        .map(s => s.slice("scope_".length));
};
const encryptPassword2 = (password, salt) => {
    const newSalt = new Buffer(salt, "base64");
    const iterations = 10000;
    const keylen = 64;
    const digest = "sha1";
    return crypto.pbkdf2Sync(password, newSalt, iterations, keylen, digest).toString("base64");
};
const isPasswordCorrect2 = (plainText, hashedPassword, salt) => {
    return encryptPassword2(plainText, salt) === hashedPassword;
};