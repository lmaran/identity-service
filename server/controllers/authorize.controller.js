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
const data_1 = require("../data");
const services_1 = require("../services");
const helpers_1 = require("../helpers");
exports.authorizeController = {
    getAuthorize: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const reqClientId = req.query.client_id;
        const reqRedirectUri = req.query.redirect_uri;
        const reqScopes = req.query.scope ? req.query.scope.split(" ") : null;
        const client = yield services_1.clientService.getClient(reqClientId);
        const accRedirectUris = client.redirect_uris;
        const accScopes = client.scope ? client.scope.split(" ") : [];
        if (!client) {
            console.log("Unknown client %s", reqClientId);
            res.render("error", { error: "Unknown client" });
            return;
        }
        else if (!_.includes(accRedirectUris, reqRedirectUri)) {
            console.log("Mismatched redirect URI, expected %s got %s", accRedirectUris, reqRedirectUri);
            res.render("error", { error: "Invalid redirect URI" });
            return;
        }
        else {
            if (_.difference(reqScopes, accScopes).length > 0) {
                const urlParsed = helpers_1.urlHelper.buildUrl(reqRedirectUri, {
                    error: "invalid_scope",
                }, null);
                res.redirect(urlParsed);
                return;
            }
            const requestId = randomstring.generate(8);
            data_1.requestData.create({ requestId, query: req.query });
            res.render("approve", { client, requestId, scopes: reqScopes });
            return;
        }
    }),
};