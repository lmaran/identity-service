import * as express from "express";
import * as path from "path";
// import config from "./src/config/environment";
import allRoutes from "./routes";

import * as url from "url";
import * as bodyParser from "body-parser";
import * as randomstring from "randomstring";
import * as cons from "consolidate";
import * as nosql2 from "nosql";
const nosql = nosql2.load("database.nosql");
import * as querystring from "querystring";
import * as qs from "qs";
import * as __ from "underscore";
import * as __string from "underscore.string";


// import base64url from "base64url";
import * as jose from "jsrsasign";

const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support form-encoded bodies (for the token endpoint)

app.engine("html", cons.underscore);
app.set("view engine", "html");
app.set("views", "server/files");
app.set("json spaces", 4);

// authorization server information
const authServer = {
    authorizationEndpoint: "http://localhost:1420/authorize",
    tokenEndpoint: "http://localhost:1420/token"
};

// client information
const clients = [
    {
        "client_id": "oauth-client-1",
        "client_secret": "oauth-client-secret-1",
        "redirect_uris": ["http://localhost:1412/callback"],
        "scope": "openid profile email phone address"
    }
];

const protectedResources = [
    {
        "resource_id": "protected-resource-1",
        "resource_secret": "protected-resource-secret-1"
    }
];

const rsaKey = {
    "alg": "RS256",
    "d": "ZXFizvaQ0RzWRbMExStaS_-yVnjtSQ9YslYQF1kkuIoTwFuiEQ2OywBfuyXhTvVQxIiJqPNnUyZR6kXAhyj__wS_Px1EH8zv7BHVt1N5TjJGlubt1dhAFCZQmgz0D-PfmATdf6KLL4HIijGrE8iYOPYIPF_FL8ddaxx5rsziRRnkRMX_fIHxuSQVCe401hSS3QBZOgwVdWEb1JuODT7KUk7xPpMTw5RYCeUoCYTRQ_KO8_NQMURi3GLvbgQGQgk7fmDcug3MwutmWbpe58GoSCkmExUS0U-KEkHtFiC8L6fN2jXh1whPeRCa9eoIK8nsIY05gnLKxXTn5-aPQzSy6Q",
    "e": "AQAB",
    "n": "p8eP5gL1H_H9UNzCuQS-vNRVz3NWxZTHYk1tG9VpkfFjWNKG3MFTNZJ1l5g_COMm2_2i_YhQNH8MJ_nQ4exKMXrWJB4tyVZohovUxfw-eLgu1XQ8oYcVYW8ym6Um-BkqwwWL6CXZ70X81YyIMrnsGTyTV6M8gBPun8g2L8KbDbXR1lDfOOWiZ2ss1CRLrmNM-GRp3Gj-ECG7_3Nx9n_s5to2ZtwJ1GS1maGjrSZ9GRAYLrHhndrL_8ie_9DS2T-ML7QNQtNkg2RvLv4f0dpjRYI23djxVtAylYK4oiT_uEMgSkc4dxwKwGuBxSO0g9JOobgfy0--FUHHYtRi0dOFZw",
    "kty": "RSA",
    "kid": "authserver"
};

const userInfo = {

    "alice": {
        "sub": "9XE3-JI34-00132A",
        "preferred_username": "alice",
        "name": "Alice",
        "email": "alice.wonderland@example.com",
        "email_verified": true
    },

    "bob": {
        "sub": "1ZT5-OE63-57383B",
        "preferred_username": "bob",
        "name": "Bob",
        "email": "bob.loblob@example.net",
        "email_verified": false
    },

    "carol": {
        "sub": "F5Q1-L6LGG-959FS",
        "preferred_username": "carol",
        "name": "Carol",
        "email": "carol.lewis@example.net",
        "email_verified": true,
        "username": "clewis",
        "password": "user password!"
    }
};

const getUser = function (username) {
    return userInfo[username];
};

const codes = {};

const requests = {};

const getClient = function (clientId) {
    return __.find(clients, function (client) { return client.client_id == clientId; });
};

const getProtectedResource = function (resourceId) {
    return __.find(protectedResources, function (resource) { return resource.resource_id == resourceId; });
};

app.get("/", function (req, res) {
    res.render("index", { clients: clients, authServer: authServer });
});

app.get("/authorize", function (req, res) {

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
                error: "invalid_scope"
            }, undefined);
            res.redirect(urlParsed);
            return;
        }

        const reqid = randomstring.generate(8);

        requests[reqid] = req.query;

        res.render("approve", { client: client, reqid: reqid, scope: rscope });
        return;
    }

});

app.post("/approve", function (req, res) {

    const reqid = req.body.reqid;
    const query = requests[reqid];
    delete requests[reqid];

    if (!query) {
        // there was no matching saved request, this is an error
        res.render("error", { error: "No matching authorization request" });
        return;
    }

    if (req.body.approve) {
        if (query.response_type == "code") {
            // user approved access
            const code = randomstring.generate(8);

            const user = getUser(req.body.user);

            const scope = getScopesFromForm(req.body);

            const client = getClient(query.client_id);
            const cscope = client.scope ? client.scope.split(" ") : undefined;
            if (__.difference(scope, cscope).length > 0) {
                // client asked for a scope it couldn't have
                const urlParsed = buildUrl(query.redirect_uri, {
                    error: "invalid_scope"
                }, undefined);
                res.redirect(urlParsed);
                return;
            }

            // save the code and request for later
            codes[code] = { request: query, scope: scope, user: user };

            const urlParsed = buildUrl(query.redirect_uri, {
                code: code,
                state: query.state
            }, undefined);
            res.redirect(urlParsed);
            return;
        } else {
            // we got a response type we don't understand
            const urlParsed = buildUrl(query.redirect_uri, {
                error: "unsupported_response_type"
            }, undefined);
            res.redirect(urlParsed);
            return;
        }
    } else {
        // user denied access
        const urlParsed = buildUrl(query.redirect_uri, {
            error: "access_denied"
        }, undefined);
        res.redirect(urlParsed);
        return;
    }

});

app.post("/token", function (req, res) {

    const auth = req.headers["authorization"];
    let clientId = undefined;
    let clientSecret = undefined;
    if (auth) {
        // check the auth header
        const clientCredentials = decodeClientCredentials(auth);
        clientId = clientCredentials.id;
        clientSecret = clientCredentials.secret;
    }

    // otherwise, check the post body
    if (req.body.client_id) {
        if (clientId) {
            // if we've already seen the client's credentials in the authorization header, this is an error
            console.log("Client attempted to authenticate with multiple methods");
            res.status(401).json({ error: "invalid_client" });
            return;
        }

        clientId = req.body.client_id;
        const clientSecret = req.body.client_secret;
    }

    const client = getClient(clientId);
    if (!client) {
        console.log("Unknown client %s", clientId);
        res.status(401).json({ error: "invalid_client" });
        return;
    }

    if (client.client_secret != clientSecret) {
        console.log("Mismatched client secret, expected %s got %s", client.client_secret, clientSecret);
        res.status(401).json({ error: "invalid_client" });
        return;
    }

    if (req.body.grant_type == "authorization_code") {

        const code = codes[req.body.code];

        if (code) {
            delete codes[req.body.code]; // burn our code, it's been used
            if (code.request.client_id == clientId) {

                const header = { "typ": "JWT", "alg": rsaKey.alg, "kid": rsaKey.kid };


                // var payload = {
                // 	iss: 'http://localhost:9001/',
                // 	sub: code.user ? code.user.sub : null,
                // 	aud: 'http://localhost:9002/',
                // 	iat: Math.floor(Date.now() / 1000),
                // 	exp: Math.floor(Date.now() / 1000) + (5 * 60),
                // 	jti: randomstring.generate(8)
                // };
                // console.log(payload);
                // var stringHeader = JSON.stringify(header);
                // var stringPayload = JSON.stringify(payload);
                // //var encodedHeader = base64url.encode(JSON.stringify(header));
                // //var encodedPayload = base64url.encode(JSON.stringify(payload));
                // //var access_token = encodedHeader + '.' + encodedPayload + '.';
                // //var access_token = jose.jws.JWS.sign('HS256', stringHeader, stringPayload, new Buffer(sharedTokenSecret).toString('hex'));
                // var privateKey = jose.KEYUTIL.getKey(rsaKey);
                // var access_token = jose.jws.JWS.sign(rsaKey.alg, stringHeader, stringPayload, privateKey);


                const access_token = randomstring.generate();
                nosql.insert({ access_token: access_token, client_id: clientId, scope: code.scope, user: code.user });

                console.log("Issuing access token %s", access_token);
                console.log("with scope %s", code.scope);

                let cscope = undefined;
                if (code.scope) {
                    cscope = code.scope.join(" ");
                }

                const token_response: any = { access_token: access_token, token_type: "Bearer", scope: cscope };

                if (__.contains(code.scope, "openid")) {
                    const ipayload: any = {
                        iss: "http://localhost:1420/",
                        sub: code.user.sub,
                        aud: client.client_id,
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + (5 * 60)
                    };
                    if (code.request.nonce) {
                        ipayload.nonce = code.request.nonce;
                    }

                    const istringHeader = JSON.stringify(header);
                    const istringPayload = JSON.stringify(ipayload);
                    const privateKey = jose.KEYUTIL.getKey(rsaKey);
                    const id_token = jose.jws.JWS.sign(rsaKey.alg, istringHeader, istringPayload, privateKey);

                    console.log("Issuing ID token %s", id_token);

                    token_response.id_token = id_token;

                }

                res.status(200).json(token_response);
                console.log("Issued tokens for code %s", req.body.code);

                return;
            } else {
                console.log("Client mismatch, expected %s got %s", code.request.client_id, clientId);
                res.status(400).json({ error: "invalid_grant" });
                return;
            }
        } else {
            console.log("Unknown code, %s", req.body.code);
            res.status(400).json({ error: "invalid_grant" });
            return;
        }
    } else {
        console.log("Unknown grant type %s", req.body.grant_type);
        res.status(400).json({ error: "unsupported_grant_type" });
    }
});



const buildUrl = function (base, options, hash) {
    const newUrl = url.parse(base, true);
    delete newUrl.search;
    if (!newUrl.query) {
        newUrl.query = {};
    }
    __.each(options, function (value, key, list) {
        newUrl.query[key] = value;
    });
    if (hash) {
        newUrl.hash = hash;
    }

    return url.format(newUrl);
};

const getScopesFromForm = function (body) {
    return __.filter(__.keys(body), function (s) { return __string.startsWith(s, "scope_"); })
        .map(function (s) { return s.slice("scope_".length); });
};

const decodeClientCredentials = function (auth) {
    const clientCredentials = new Buffer(auth.slice("basic ".length), "base64").toString().split(":");
    const clientId = querystring.unescape(clientCredentials[0]);
    const clientSecret = querystring.unescape(clientCredentials[1]);
    return { id: clientId, secret: clientSecret };
};

app.use("/", express.static("server/files"));

// clear the database
nosql.clear();



app.use(allRoutes);


export default app;