import { Request, Response, NextFunction } from "express";
import * as _ from "lodash";
import { IClient } from "@interfaces";
import { requestData } from "../data";
import { clientService } from "../services";
import { urlHelper } from "../helpers";
import * as err from "../errors";
import { OAuthAuthorizationError, ReturnAs } from "../constants";

export const authorizeController = {

    getAuthorize: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tenantCode = req.ctx.tenantCode;
            if (!tenantCode) {
                throw new err.ValidationError("Missing tenant", {
                    developerMessage: `There was no tenant code`,
                    returnAs: ReturnAs.RENDER,
                });
            }

            // requested values
            const clientId: string = req.query.client_id;
            const redirectUri: string = req.query.redirect_uri;


            const client: IClient = await clientService.getByCode(clientId, tenantCode);

            // accepted values
            const accRedirectUris: string[] = client.redirect_uris;

            // https://tools.ietf.org/html/rfc6749#section-4.1.2

            // If the request fails due to a missing, invalid, or mismatching
            // REDIRECTION URI, or if the CLIENT IDENTIFIER is missing or invalid,
            // the authorization server SHOULD inform the resource owner of the
            // error and MUST NOT automatically redirect the user-agent to the
            // invalid redirection URI.

            if (!client) {
                throw new err.ValidationError(`Unknown client`, {
                    developerMessage: `Unknown client ${req.query.client_id}`,
                    returnAs: ReturnAs.RENDER,
                });
            }

            if (!_.includes(accRedirectUris, redirectUri)) {
                throw new err.ValidationError(`Invalid redirect URI`, {
                    developerMessage: `Mismatched redirect URI, expected ${accRedirectUris} got ${redirectUri}`,
                    returnAs: ReturnAs.RENDER,
                });
            }

            // If the resource owner denies the access request or if the request
            // fails for reasons other than a missing or invalid redirection URI,
            // the authorization server informs the client by adding the following
            // parameters to the query component of the redirection URI using the
            // "application/x-www-form-urlencoded" format, per Appendix B:

            const reqScopes = req.query.scope ? req.query.scope.split(" ") : null;
            const accScopes = client.scope ? client.scope.split(" ") : [];
            // _.difference([2, 1], [2, 3]); => [1]
            if (_.difference(reqScopes, accScopes).length > 0) {
                throw new err.ValidationError(OAuthAuthorizationError.INVALID_SCOPE, {
                    developerMessage: `client asked for a scope it couldn't have`,
                    returnAs: ReturnAs.REDIRECT,
                    redirectUri,
                });
            }

            requestData.create({ requestId: req.ctx.requestId, query: req.query }); // don't have to wait to complete

            res.render("approve", { client, requestId: req.ctx.requestId, scopes: reqScopes, tenantCode });
            return;

        } catch (err) {
            next(err);
        }

    },

};
