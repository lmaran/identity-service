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
const err = require("../errors");
exports.authorizeController = {
    getAuthorize: (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const reqClientId = req.query.client_id;
            const reqRedirectUri = req.query.redirect_uri;
            const tenantCode = req.tenantCode;
            if (!tenantCode) {
                throw new err.BadRequestError("Missing tenant");
            }
            const client = yield services_1.clientService.getByCode(reqClientId, tenantCode);
            const accRedirectUris = client.redirect_uris;
            if (!client) {
                throw new err.ValidationError(`Unknown client`, {
                    developerMessage: `Unknown client ${req.query.client_id}`,
                    returnAs: "render",
                });
            }
            if (!_.includes(accRedirectUris, reqRedirectUri)) {
                throw new err.ValidationError(`Invalid redirect URI`, {
                    developerMessage: `Mismatched redirect URI, expected ${accRedirectUris} got ${reqRedirectUri}`,
                    returnAs: "render",
                });
            }
            const reqScopes = req.query.scope ? req.query.scope.split(" ") : null;
            const accScopes = client.scope ? client.scope.split(" ") : [];
            if (_.difference(reqScopes, accScopes).length > 0) {
                throw new err.ValidationError("invalid_scope", {
                    developerMessage: `client asked for a scope it couldn't have`,
                    returnAs: "redirect",
                    redirectUri: reqRedirectUri,
                });
            }
            const requestId = randomstring.generate(8);
            data_1.requestData.create({ requestId, query: req.query });
            res.render("approve", { client, requestId, scopes: reqScopes, tenantCode });
            return;
        }
        catch (err) {
            next(err);
        }
    }),
};
