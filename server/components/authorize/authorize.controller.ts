import { Request, Response } from "express";
import * as _ from "lodash";
import * as randomstring from "randomstring";
import { requests } from "../shared/data";
import { IClient } from "@interfaces";
import { buildUrl } from "../../helpers";
import clientService from "../client/client.service";

const authorizeController = {

    getAuthorize: async (req: Request, res: Response) => {
        // requested values
        const reqClientId: string = req.query.client_id;
        const reqRedirectUri: string = req.query.redirect_uri;
        const reqScopes = req.query.scope ? req.query.scope.split(" ") : null;

        const client: IClient = await clientService.getClient(reqClientId);

        // accepted valus
        const accRedirectUris: string[] = client.redirect_uris;
        const accScopes = client.scope ? client.scope.split(" ") : null;

        if (!client) {
            console.log("Unknown client %s", reqClientId);
            res.render("error", { error: "Unknown client" });
            return;
        } else if (!_.includes(accRedirectUris, reqRedirectUri)) {
            console.log("Mismatched redirect URI, expected %s got %s", accRedirectUris, reqRedirectUri);
            res.render("error", { error: "Invalid redirect URI" });
            return;
        } else {
            // _.difference([2, 1], [2, 3]); => [1]
            if (_.difference(reqScopes, accScopes).length > 0) {
                // client asked for a scope it couldn't have
                const urlParsed = buildUrl(reqRedirectUri, {
                    error: "invalid_scope",
                }, null);
                res.redirect(urlParsed);
                return;
            }

            const requestId = randomstring.generate(8);

            requests[requestId] = req.query;

            res.render("../components/approve/approve", { client, requestId, scopes: reqScopes });
            return;
        }

    },

};

export default authorizeController;
