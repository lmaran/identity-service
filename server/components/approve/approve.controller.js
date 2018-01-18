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
const data_1 = require("../shared/data");
const helpers_1 = require("../../helpers");
const client_service_1 = require("../client/client.service");
const user_service_1 = require("../user/user.service");
const approveController = {
    approve: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const requestId = req.body.requestId;
        const query = data_1.requests[requestId];
        delete data_1.requests[requestId];
        let urlParsed;
        if (!query) {
            res.render("error", { error: "No matching authorization request" });
            return;
        }
        if (req.body.approve) {
            if (query.response_type === "code") {
                const code = randomstring.generate(8);
                const user = yield user_service_1.default.getUser(req.body.user);
                const scopes = getScopesFromForm(req.body);
                const client = yield client_service_1.default.getClient(query.client_id);
                const cscope = client.scope ? client.scope.split(" ") : undefined;
                if (_.difference(scopes, cscope).length > 0) {
                    urlParsed = helpers_1.buildUrl(query.redirect_uri, {
                        error: "invalid_scope",
                    }, null);
                    res.redirect(urlParsed);
                    return;
                }
                data_1.codes[code] = { request: query, scope: scopes, user };
                urlParsed = helpers_1.buildUrl(query.redirect_uri, {
                    code,
                    state: query.state,
                }, null);
                res.redirect(urlParsed);
                return;
            }
            else {
                urlParsed = helpers_1.buildUrl(query.redirect_uri, {
                    error: "unsupported_response_type",
                }, null);
                res.redirect(urlParsed);
                return;
            }
        }
        else {
            urlParsed = helpers_1.buildUrl(query.redirect_uri, {
                error: "access_denied",
            }, null);
            res.redirect(urlParsed);
            return;
        }
    }),
};
const getScopesFromForm = body => {
    return _.filter(_.keys(body), s => _.startsWith(s, "scope_"))
        .map(s => s.slice("scope_".length));
};
exports.default = approveController;
