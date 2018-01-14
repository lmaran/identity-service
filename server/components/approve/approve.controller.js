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
const __string = require("underscore.string");
const url = require("url");
const randomstring = require("randomstring");
const data_1 = require("../shared/data");
const approveController = {
    approve: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const reqid = req.body.reqid;
        const query = data_1.requests[reqid];
        delete data_1.requests[reqid];
        let urlParsed;
        if (!query) {
            res.render("error", { error: "No matching authorization request" });
            return;
        }
        if (req.body.approve) {
            if (query.response_type === "code") {
                const code = randomstring.generate(8);
                const user = getUser(req.body.user);
                const scope = getScopesFromForm(req.body);
                const client = getClient(query.client_id);
                const cscope = client.scope ? client.scope.split(" ") : undefined;
                if (__.difference(scope, cscope).length > 0) {
                    urlParsed = buildUrl(query.redirect_uri, {
                        error: "invalid_scope",
                    }, undefined);
                    res.redirect(urlParsed);
                    return;
                }
                data_1.codes[code] = { request: query, scope, user };
                urlParsed = buildUrl(query.redirect_uri, {
                    code,
                    state: query.state,
                }, undefined);
                res.redirect(urlParsed);
                return;
            }
            else {
                urlParsed = buildUrl(query.redirect_uri, {
                    error: "unsupported_response_type",
                }, undefined);
                res.redirect(urlParsed);
                return;
            }
        }
        else {
            urlParsed = buildUrl(query.redirect_uri, {
                error: "access_denied",
            }, undefined);
            res.redirect(urlParsed);
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
const userInfo = {
    alice: {
        sub: "9XE3-JI34-00132A",
        preferred_username: "alice",
        name: "Alice",
        email: "alice.wonderland@example.com",
        email_verified: true,
    },
    bob: {
        sub: "1ZT5-OE63-57383B",
        preferred_username: "bob",
        name: "Bob",
        email: "bob.loblob@example.net",
        email_verified: false,
    },
    carol: {
        sub: "F5Q1-L6LGG-959FS",
        preferred_username: "carol",
        name: "Carol2",
        email: "carol.lewis@example.net",
        email_verified: true,
        username: "clewis",
        password: "user password!",
    },
};
const getUser = username => {
    return userInfo[username];
};
const getScopesFromForm = body => {
    return __.filter(__.keys(body), s => __string.startsWith(s, "scope_"))
        .map(s => s.slice("scope_".length));
};
exports.default = approveController;
