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
const __ = require("underscore");
const url = require("url");
const randomstring = require("randomstring");
const data_1 = require("../shared/data");
const authorizeController = {
    getAuthorize: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const client = getClient(req.query.client_id);
        if (!client) {
            console.log("Unknown client %s", req.query.client_id);
            res.render("error", { error: "Unknown client" });
            return;
        }
        else if (!__.contains(client.redirect_uris, req.query.redirect_uri)) {
            console.log("Mismatched redirect URI, expected %s got %s", client.redirect_uris, req.query.redirect_uri);
            res.render("error", { error: "Invalid redirect URI" });
            return;
        }
        else {
            const rscope = req.query.scope ? req.query.scope.split(" ") : undefined;
            const cscope = client.scope ? client.scope.split(" ") : undefined;
            if (__.difference(rscope, cscope).length > 0) {
                const urlParsed = buildUrl(req.query.redirect_uri, {
                    error: "invalid_scope",
                }, undefined);
                res.redirect(urlParsed);
                return;
            }
            const reqid = randomstring.generate(8);
            data_1.requests[reqid] = req.query;
            res.render("approve", { client, reqid, scope: rscope });
            return;
        }
    }),
};
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
exports.default = authorizeController;
