import { Request, Response, NextFunction } from "express";
import * as _ from "lodash";
import * as randomstring from "randomstring";
import { IClient } from "@interfaces";
import { requestData } from "../data";
import { clientService } from "../services";
import { urlHelper } from "../helpers";
import * as err from "../errors";
import { OAuthAuthorizationError } from "../constants";

export const authorizeController = {

    getAuthorize: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // requested values
            const reqClientId: string = req.query.client_id;
            const reqRedirectUri: string = req.query.redirect_uri;

            const tenantCode = req.tenantCode;

            if (!tenantCode) {
                throw new err.BadRequestError("Missing tenant");
            }

            const client: IClient = await clientService.getByCode(reqClientId, tenantCode);

            // accepted values
            const accRedirectUris: string[] = client.redirect_uris;

            // https://tools.ietf.org/html/rfc6749#section-4.1.2

            // If the request fails due to a missing, invalid, or mismatching
            // REDIRECTION URI, or if the CLIENT IDENTIFIER is missing or invalid,
            // the authorization server SHOULD inform the resource owner of the
            // error and MUST NOT automatically redirect the user-agent to the
            // invalid redirection URI.

            if (!client) {
                // console.log('Unknown client %s', req.query.client_id);
                // res.render('error', {error: 'Unknown client'});
                throw new err.ValidationError(`Unknown client: ${reqClientId}`);
            } else if (!_.includes(accRedirectUris, reqRedirectUri)) {
                // console.log("Mismatched redirect URI, expected %s got %s", accRedirectUris, reqRedirectUri);
                // res.render("error", { error: "Invalid redirect URI" });
                // return;
                throw new err.ValidationError(`Invalid redirect URI`);
            } else {

                // If the resource owner denies the access request or if the request
                // fails for reasons other than a missing or invalid redirection URI,
                // the authorization server informs the client by adding the following
                // parameters to the query component of the redirection URI using the
                // "application/x-www-form-urlencoded" format, per Appendix B:

                const reqScopes = req.query.scope ? req.query.scope.split(" ") : null;
                const accScopes = client.scope ? client.scope.split(" ") : [];
                // _.difference([2, 1], [2, 3]); => [1]
                if (_.difference(reqScopes, accScopes).length > 0) {
                    // client asked for a scope it couldn't have
                    const urlParsed = urlHelper.buildUrl(reqRedirectUri, {
                        error: OAuthAuthorizationError.INVALID_SCOPE,
                    }, null);
                    res.redirect(urlParsed);
                    return;
                }

                const requestId = randomstring.generate(8);
                requestData.create({ requestId, query: req.query }); // don't have to wait to complete

                res.render("approve", { client, requestId, scopes: reqScopes, tenantCode });
                return;
            }
        } catch (err) {
            next(err);
        }

    },

};
