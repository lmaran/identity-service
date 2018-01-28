import { Request, Response, NextFunction } from "express";
import * as _ from "lodash";
import * as randomstring from "randomstring";
import { IClient } from "@interfaces";
import { requestData } from "../data";
import { clientService } from "../services";
import { urlHelper } from "../helpers";
import { ApplicationError } from "../errors/application.error";

export const authorizeController = {

    getAuthorize: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // requested values
            const reqClientId: string = req.query.client_id;
            const reqRedirectUri: string = req.query.redirect_uri;
            const reqScopes = req.query.scope ? req.query.scope.split(" ") : null;
            // let err;

            const tenantCode = req.tenantCode;

            if (!tenantCode) {
                throw new ApplicationError("Missing tenant", 400);
            }

            const client: IClient = await clientService.getByCode(reqClientId, tenantCode);

            // accepted values
            const accRedirectUris: string[] = client.redirect_uris;
            const accScopes = client.scope ? client.scope.split(" ") : [];

            if (!client) {
                throw new ApplicationError(`Unknown client: ${reqClientId}`, 400);
            } else if (!_.includes(accRedirectUris, reqRedirectUri)) {
                // console.log("Mismatched redirect URI, expected %s got %s", accRedirectUris, reqRedirectUri);
                // res.render("error", { error: "Invalid redirect URI" });
                // return;
                throw new ApplicationError(`Invalid redirect URI`, 400);
            } else {
                // _.difference([2, 1], [2, 3]); => [1]
                if (_.difference(reqScopes, accScopes).length > 0) {
                    // client asked for a scope it couldn't have
                    const urlParsed = urlHelper.buildUrl(reqRedirectUri, {
                        error: "invalid_scope",
                    }, null);
                    res.redirect(urlParsed);
                    return;
                }

                const requestId = randomstring.generate(8);
                requestData.create({requestId, query: req.query}); // don't have to wait to complete

                res.render("approve", { client, requestId, scopes: reqScopes, tenantCode });
                return;
            }
        } catch (err) {
            next(err);
        }

    },

};
