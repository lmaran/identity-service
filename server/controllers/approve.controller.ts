import { Request, Response } from "express";
import * as _ from "lodash";
import * as url from "url";
import * as randomstring from "randomstring";
import * as crypto from "crypto";
import { IClient, IUser, IPersistedPassword } from "@interfaces";
import { requestData, codeData } from "../data";
import { clientService, userService } from "../services";
import { urlHelper, passwordHelper } from "../helpers";

export const approveController = {

    // POST
    approve: async (req: Request, res: Response) => {
        const requestId = req.body.requestId;
        const request = await requestData.get(requestId);
        const query = request.query;
        requestData.delete(requestId); // don't have to wait to complete

        let urlParsed;

        if (!query) {
            // there was no matching saved request, this is an error
            res.render("error", { error: "No matching authorization request" });
            return;
        }

        if (req.body.approve) {
            if (query.response_type === "code") {

                const tenantCode = req.tenantCode;
                if (!tenantCode) {
                    console.log("Missing tenant");
                    res.render("error", { error: "Missing tenant" });
                    return;
                }

                // user approved access
                const code = randomstring.generate(8);

                // const user = await userService.getUser(req.body.user);
                const user = await userService.getUserByEmail(req.body.email, tenantCode);

                console.log(user);

                if (!user) {
                    // client asked for a scope it couldn't have
                    urlParsed = urlHelper.buildUrl(query.redirect_uri, {
                        error: "user not found",
                    }, null);
                    res.redirect(urlParsed);
                    return;
                }

                const persistedPassword = {
                    salt: user.salt,
                    hashedPassword: user.hashedPassword,
                };

                const pswMatch = passwordHelper.passwordMatch(persistedPassword, req.body.password);
                // const isPswCorrect = pswMatch(req.body.password, user.hashedPassword, user.salt);

                if (!pswMatch) {
                    // client asked for a scope it couldn't have
                    urlParsed = urlHelper.buildUrl(query.redirect_uri, {
                        error: "incorrect password",
                    }, null);
                    res.redirect(urlParsed);
                    return;
                }

                const scopes = getScopesFromForm(req.body);

                const client = await clientService.getClient(query.client_id, tenantCode);
                const cscope = client.scope ? client.scope.split(" ") : [];
                // _.difference([2, 1], [2, 3]); => [1]
                if (_.difference(scopes, cscope).length > 0) {
                    // client asked for a scope it couldn't have
                    urlParsed = urlHelper.buildUrl(query.redirect_uri, {
                        error: "invalid_scope",
                    }, null);
                    res.redirect(urlParsed);
                    return;
                }

                // save the code and request for later
                codeData.create({code, request: query, scope: scopes, user }); // don't have to wait to complete

                urlParsed = urlHelper.buildUrl(query.redirect_uri, {
                    code,
                    state: query.state,
                }, null);
                res.redirect(urlParsed);
                return;
            } else {
                // we got a response type we don't understand
                urlParsed = urlHelper.buildUrl(query.redirect_uri, {
                    error: "unsupported_response_type",
                }, null);
                res.redirect(urlParsed);
                return;
            }
        } else {
            // user denied access
            urlParsed = urlHelper.buildUrl(query.redirect_uri, {
                error: "access_denied",
            }, null);
            res.redirect(urlParsed);
            return;
        }

    },

};

const getScopesFromForm = body => {
    // _.keys({one: 1, two: 2); => => ["one", "two"]
    return _.filter(_.keys(body), s => _.startsWith(s, "scope_"))
        .map(s => s.slice("scope_".length));
};

// const makeSalt = () => {
//     return crypto.randomBytes(16).toString("base64");
// };

const encryptPassword2 = (password, salt) => {
    // if (!password || !salt) { return ""; }
    const newSalt = new Buffer(salt, "base64");
    const iterations = 10000;
    const keylen = 64;
    const digest = "sha1";
    return crypto.pbkdf2Sync(password, newSalt, iterations, keylen, digest).toString("base64");
};

const isPasswordCorrect2 = (plainText, hashedPassword, salt) => {
    return encryptPassword2(plainText, salt) === hashedPassword;
};
