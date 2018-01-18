import { Request, Response } from "express";
import * as _ from "lodash";
import * as querystring from "querystring";
import * as randomstring from "randomstring";
import {requests, codes} from "../shared/data";
import * as jose from "jsrsasign";
import * as nosql2 from "nosql";
import clientService from "../client/client.service";

const nosql = nosql2.load("database.nosql");

const tokenController = {

    // POST
    getToken: async (req: Request, res: Response) => {
        const auth = req.headers.authorization;
        let clientId;
        let clientSecret;
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
            clientSecret = req.body.client_secret;
        }

        const client = await clientService.getClient(clientId);
        if (!client) {
            console.log("Unknown client %s", clientId);
            res.status(401).json({ error: "invalid_client" });
            return;
        }

        if (client.client_secret !== clientSecret) {
            console.log("Mismatched client secret, expected %s got %s", client.client_secret, clientSecret);
            res.status(401).json({ error: "invalid_client" });
            return;
        }

        if (req.body.grant_type === "authorization_code") {

            const code = codes[req.body.code];

            if (code) {
                delete codes[req.body.code]; // burn our code, it's been used
                if (code.request.client_id === clientId) {

                    const header = { typ: "JWT", alg: rsaKey.alg, kid: rsaKey.kid };

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
                    nosql.insert({ access_token, client_id: clientId, scope: code.scope, user: code.user });

                    console.log("Issuing access token %s", access_token);
                    console.log("with scope %s", code.scope);

                    let cscope;
                    if (code.scope) {
                        cscope = code.scope.join(" ");
                    }

                    const token_response: any = { access_token, token_type: "Bearer", scope: cscope };

                    if (_.includes(code.scope, "openid")) {
                        const ipayload: any = {
                            iss: "http://localhost:1420/",
                            sub: code.user.sub,
                            aud: client.client_id,
                            iat: Math.floor(Date.now() / 1000),
                            exp: Math.floor(Date.now() / 1000) + (5 * 60),
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

    },

};

const decodeClientCredentials = auth => {
    const clientCredentials = new Buffer(auth.slice("basic ".length), "base64").toString().split(":");
    const clientId = querystring.unescape(clientCredentials[0]);
    const clientSecret = querystring.unescape(clientCredentials[1]);
    return { id: clientId, secret: clientSecret };
};

const rsaKey = {
    alg: "RS256",
    d: "ZXFizvaQ0RzWRbMExStaS_-yVnjtSQ9YslYQF1kkuIoTwFuiEQ2OywBfuyXhTvVQxIiJqPNnUyZR6kXAhyj__wS_Px1EH8zv7BHVt1N5TjJGlubt1dhAFCZQmgz0D-PfmATdf6KLL4HIijGrE8iYOPYIPF_FL8ddaxx5rsziRRnkRMX_fIHxuSQVCe401hSS3QBZOgwVdWEb1JuODT7KUk7xPpMTw5RYCeUoCYTRQ_KO8_NQMURi3GLvbgQGQgk7fmDcug3MwutmWbpe58GoSCkmExUS0U-KEkHtFiC8L6fN2jXh1whPeRCa9eoIK8nsIY05gnLKxXTn5-aPQzSy6Q",
    e: "AQAB",
    n: "p8eP5gL1H_H9UNzCuQS-vNRVz3NWxZTHYk1tG9VpkfFjWNKG3MFTNZJ1l5g_COMm2_2i_YhQNH8MJ_nQ4exKMXrWJB4tyVZohovUxfw-eLgu1XQ8oYcVYW8ym6Um-BkqwwWL6CXZ70X81YyIMrnsGTyTV6M8gBPun8g2L8KbDbXR1lDfOOWiZ2ss1CRLrmNM-GRp3Gj-ECG7_3Nx9n_s5to2ZtwJ1GS1maGjrSZ9GRAYLrHhndrL_8ie_9DS2T-ML7QNQtNkg2RvLv4f0dpjRYI23djxVtAylYK4oiT_uEMgSkc4dxwKwGuBxSO0g9JOobgfy0--FUHHYtRi0dOFZw",
    kty: "RSA",
    kid: "authserver",
};

// clear the database
nosql.clear();

export default tokenController;
