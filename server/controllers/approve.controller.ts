import { Request, Response, NextFunction } from "express";
import * as _ from "lodash";
import * as url from "url";
import * as randomstring from "randomstring";
import { IClient, IUser, IPersistedPassword } from "@interfaces";
import { requestData, codeData } from "../data";
import { clientService, userService } from "../services";
import { urlHelper, passwordHelper } from "../helpers";
import * as err from "../errors";
import { OAuthAuthorizationError, ReturnType } from "../constants";

export const approveController = {

    // POST
    approve: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tenantCode = req.ctx.tenantCode;
            if (!tenantCode) {
                throw new err.ValidationError("Missing tenant")
                    .withDeveloperMessage("There was no tenant code")
                    .withReturnAs(ReturnType.RENDER);
            }

            const requestId = req.body.requestId;
            const request = await requestData.get(requestId);
            const query = request.query;
            requestData.delete(requestId); // don't have to wait to complete

            let urlParsed;

            if (!query) {
                throw new err.ValidationError("No matching authorization request")
                    .withDeveloperMessage("There was no matching saved request")
                    .withReturnAs(ReturnType.RENDER);
            }

            if (!req.body.approve) {
                throw new err.ValidationError(OAuthAuthorizationError.ACCESS_DENIED)
                    .withDeveloperMessage("User denied access")
                    .withReturnAs(ReturnType.REDIRECT)
                    .withRedirectUri(query.redirect_uri);
            }

            if (query.response_type !== "code") {
                throw new err.ValidationError(OAuthAuthorizationError.UNSUPPORTED_RESPONSE_TYPE)
                    .withDeveloperMessage("We got a response type we don't understand (response_type !== 'code')")
                    .withReturnAs(ReturnType.REDIRECT)
                    .withRedirectUri(query.redirect_uri);
            }

            // user approved access
            const code = randomstring.generate(8);

            const user = await userService.getUserByEmail(req.body.email, tenantCode);
            if (!user) {
                throw new err.ValidationError("User not found")
                    .withDeveloperMessage(`User ${req.body.email} not found for tenant ${tenantCode}`)
                    .withReturnAs(ReturnType.REDIRECT)
                    .withRedirectUri(query.redirect_uri);
            }

            const persistedPassword = {
                salt: user.salt,
                hashedPassword: user.hashedPassword,
            };

            const pswMatch = passwordHelper.passwordMatch(persistedPassword, req.body.password);

            if (!pswMatch) {
                throw new err.ValidationError("Incorrect password")
                    .withDeveloperMessage("Passwords not match")
                    .withReturnAs(ReturnType.REDIRECT)
                    .withRedirectUri(query.redirect_uri);
            }

            const client = await clientService.getByCode(query.client_id, tenantCode);
            const cscope = client.scope ? client.scope.split(" ") : [];
            const scopes = getScopesFromForm(req.body);

            // _.difference([2, 1], [2, 3]); => [1]
            const exceededScopes = _.difference(scopes, cscope);
            if (exceededScopes.length > 0) {
                throw new err.ValidationError(OAuthAuthorizationError.INVALID_SCOPE)
                    .withDeveloperMessage(`Client asked for a scope it couldn't have: ${exceededScopes.join(", ")}`)
                    .withReturnAs(ReturnType.REDIRECT)
                    .withRedirectUri(query.redirect_uri);
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
