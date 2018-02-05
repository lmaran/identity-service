import { Request, Response, NextFunction } from "express";
import * as _ from "lodash";
import * as url from "url";
import * as randomstring from "randomstring";
import * as crypto from "crypto";
import { IClient, IUser, IPersistedPassword } from "@interfaces";
import { requestData, codeData } from "../data";
import { clientService, userService } from "../services";
import { urlHelper, passwordHelper } from "../helpers";
import * as err from "../errors";
import { OAuthAuthorizationError, ReturnAs } from "../constants";

export const approveController = {

    // POST
    approve: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const requestId = req.body.requestId;
            const request = await requestData.get(requestId);
            const query = request.query;
            requestData.delete(requestId); // don't have to wait to complete

            let urlParsed;

            if (!query) {
                // // there was no matching saved request, this is an error
                // res.render("error", { error: "No matching authorization request" });
                // return;
                throw new err.ValidationError("No matching authorization request", {
                    developerMessage: `There was no matching saved request`,
                    returnAs: ReturnAs.RENDER,
                });
            }

            if (!req.body.approve) {
                // user denied access
                // urlParsed = urlHelper.buildUrl(query.redirect_uri, {
                //     error: OAuthAuthorizationError.ACCESS_DENIED,
                // }, null);
                // res.redirect(urlParsed);
                // return;
                throw new err.ValidationError(OAuthAuthorizationError.ACCESS_DENIED, {
                    developerMessage: `"req.body.approve" is falsy`,
                    returnAs: ReturnAs.REDIRECT,
                    redirectUri: query.redirect_uri,
                });
            }

            if (query.response_type !== "code") {
                // // we got a response type we don't understand
                // urlParsed = urlHelper.buildUrl(query.redirect_uri, {
                //     error: OAuthAuthorizationError.UNSUPPORTED_RESPONSE_TYPE,
                // }, null);
                // res.redirect(urlParsed);
                // return;
                throw new err.ValidationError(OAuthAuthorizationError.UNSUPPORTED_RESPONSE_TYPE, {
                    developerMessage: `query.response_type !== "code"`,
                    returnAs: ReturnAs.REDIRECT,
                    redirectUri: query.redirect_uri,
                });
            }

            const tenantCode = req.ctx.tenantCode;
            if (!tenantCode) {
                // console.log("Missing tenant");
                // res.render("error", { error: "Missing tenant" });
                // return;
                throw new err.ValidationError("Missing tenant", {
                    developerMessage: `There was no tenant code`,
                    returnAs: ReturnAs.RENDER,
                });
            }

            // user approved access
            const code = randomstring.generate(8);

            const user = await userService.getUserByEmail(req.body.email, tenantCode);
            if (!user) {
                // urlParsed = urlHelper.buildUrl(query.redirect_uri, {
                //     error: "user not found",
                // }, null);
                // res.redirect(urlParsed);
                // return;
                throw new err.ValidationError(`User not found`, {
                    developerMessage: `user is falsy`,
                    returnAs: ReturnAs.REDIRECT,
                    redirectUri: query.redirect_uri,
                });
            }

            const persistedPassword = {
                salt: user.salt,
                hashedPassword: user.hashedPassword,
            };

            const pswMatch = passwordHelper.passwordMatch(persistedPassword, req.body.password);
            // const isPswCorrect = pswMatch(req.body.password, user.hashedPassword, user.salt);

            if (!pswMatch) {
                // urlParsed = urlHelper.buildUrl(query.redirect_uri, {
                //     error: "incorrect password",
                // }, null);
                // res.redirect(urlParsed);
                // return;
                throw new err.ValidationError(`Incorrect password`, {
                    developerMessage: `Passwords not match`,
                    returnAs: ReturnAs.REDIRECT,
                    redirectUri: query.redirect_uri,
                });
            }

            const scopes = getScopesFromForm(req.body);

            const client = await clientService.getByCode(query.client_id, tenantCode);
            const cscope = client.scope ? client.scope.split(" ") : [];
            // _.difference([2, 1], [2, 3]); => [1]
            if (_.difference(scopes, cscope).length > 0) {
                // // client asked for a scope it couldn't have
                // urlParsed = urlHelper.buildUrl(query.redirect_uri, {
                //     error: OAuthAuthorizationError.INVALID_SCOPE,
                // }, null);
                // res.redirect(urlParsed);
                // return;
                throw new err.ValidationError(OAuthAuthorizationError.INVALID_SCOPE, {
                    developerMessage: `Client asked for a scope it couldn't have`,
                    returnAs: ReturnAs.REDIRECT,
                    redirectUri: query.redirect_uri,
                });
            }

            // save the code and request for later
            codeData.create({ code, request: query, scope: scopes, user }); // don't have to wait to complete

            urlParsed = urlHelper.buildUrl(query.redirect_uri, {
                code,
                state: query.state,
            }, null);
            res.redirect(urlParsed);
            return;

        } catch (err) {
        next(err);
    }
},

};

const getScopesFromForm = body => {
    // _.keys({one: 1, two: 2); => => ["one", "two"]
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
