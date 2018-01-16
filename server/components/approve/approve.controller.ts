import { Request, Response } from "express";
import * as _ from "lodash";
import * as url from "url";
import * as randomstring from "randomstring";
import {requests, codes} from "../shared/data";

const approveController = {

    // POST
    approve: async (req: Request, res: Response) => {
        const reqid = req.body.reqid;
        const query = requests[reqid];
        delete requests[reqid];

        let urlParsed;

        if (!query) {
            // there was no matching saved request, this is an error
            res.render("error", { error: "No matching authorization request" });
            return;
        }

        if (req.body.approve) {
            if (query.response_type === "code") {
                // user approved access
                const code = randomstring.generate(8);

                const user = getUser(req.body.user);

                const scope = getScopesFromForm(req.body);

                const client = getClient(query.client_id);
                const cscope = client.scope ? client.scope.split(" ") : undefined;
                // _.difference([2, 1], [2, 3]); => [1]
                if (_.difference(scope, cscope).length > 0) {
                    // client asked for a scope it couldn't have
                    urlParsed = buildUrl(query.redirect_uri, {
                        error: "invalid_scope",
                    }, undefined);
                    res.redirect(urlParsed);
                    return;
                }

                // save the code and request for later
                codes[code] = { request: query, scope, user };

                urlParsed = buildUrl(query.redirect_uri, {
                    code,
                    state: query.state,
                }, undefined);
                res.redirect(urlParsed);
                return;
            } else {
                // we got a response type we don't understand
                urlParsed = buildUrl(query.redirect_uri, {
                    error: "unsupported_response_type",
                }, undefined);
                res.redirect(urlParsed);
                return;
            }
        } else {
            // user denied access
            urlParsed = buildUrl(query.redirect_uri, {
                error: "access_denied",
            }, undefined);
            res.redirect(urlParsed);
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
    return _.find(clients, client => client.client_id === clientId);
};

const buildUrl = (base, options, hash) => {
    const newUrl = url.parse(base, true);
    delete newUrl.search;
    if (!newUrl.query) {
        newUrl.query = {};
    }
    _.each(options, (value, key, list) => {
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

// const requests = {};

const getScopesFromForm = body => {
    // _.keys({one: 1, two: 2); => => ["one", "two"]
    return _.filter(_.keys(body), s => _.startsWith(s, "scope_"))
        .map(s => s.slice("scope_".length));
};

// const codes = {};

export default approveController;
