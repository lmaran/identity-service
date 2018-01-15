import { Request, Response } from "express";
import * as __ from "underscore";
import * as url from "url";
import * as randomstring from "randomstring";
import { requests } from "../shared/data";

const authorizeController = {

    getAuthorize: async (req: Request, res: Response) => {
        // set DEPLOYMET_SLOT as env variable on remote server
        // e.g. "celebrate-taste-blue-staging"
        // res.send("identity-service-" + (process.env.DEPLOYMENT_SLOT || "noslot") + "-" + process.env.NODE_ENV);

        const client = getClient(req.query.client_id);

        if (!client) {
            console.log("Unknown client %s", req.query.client_id);
            res.render("error", { error: "Unknown client" });
            return;
        } else if (!__.contains(client.redirect_uris, req.query.redirect_uri)) {
            console.log("Mismatched redirect URI, expected %s got %s", client.redirect_uris, req.query.redirect_uri);
            res.render("error", { error: "Invalid redirect URI" });
            return;
        } else {

            const rscope = req.query.scope ? req.query.scope.split(" ") : undefined;
            const cscope = client.scope ? client.scope.split(" ") : undefined;
            if (__.difference(rscope, cscope).length > 0) {
                // client asked for a scope it couldn't have
                const urlParsed = buildUrl(req.query.redirect_uri, {
                    error: "invalid_scope",
                }, undefined);
                res.redirect(urlParsed);
                return;
            }

            const reqid = randomstring.generate(8);

            requests[reqid] = req.query;

            res.render("../components/approve/approve", { client, reqid, scope: rscope });
            return;
        }

    },

};

// client information
const clients = [
    {
        client_id: "oauth-client-1",
        client_secret: "oauth-client-secret-1",
        redirect_uris: ["http://localhost:1412/callback"],
        scope: "openid profile email phone address",
    },
];

const getClient = clientId => {
    return __.find(clients, client => client.client_id === clientId);
};

const buildUrl = (base, options, hash) => {
    const newUrl = url.parse(base, true);
    delete newUrl.search;
    if (!newUrl.query) {
        newUrl.query = {};
    }
    __.each(options, (value, key, list) => {
        newUrl.query[key] = value;
    });
    if (hash) {
        newUrl.hash = hash;
    }

    return url.format(newUrl);
};

// not used yet
const protectedResources = [
    {
        resource_id: "protected-resource-1",
        resource_secret: "protected-resource-secret-1",
    },
];

// not used yet
const getProtectedResource = resourceId => {
    return __.find(protectedResources, resource => resource.resource_id === resourceId);
};

export default authorizeController;
