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
const querystring = require("querystring");
const randomstring = require("randomstring");
const jose = require("jsrsasign");
const services_1 = require("../services");
const data_1 = require("../data");
const err = require("../errors");
exports.tokenController = {
    getToken: (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const tenantCode = req.ctx.tenantCode;
            if (!tenantCode) {
                throw new err.ValidationError("Missing tenant")
                    .withDeveloperMessage("There was no tenant code")
                    .withReturnAs("html");
            }
            const auth = req.headers.authorization;
            let clientId;
            let clientSecret;
            if (auth) {
                const clientCredentials = decodeClientCredentials(auth);
                clientId = clientCredentials.id;
                clientSecret = clientCredentials.secret;
            }
            if (req.body.client_id) {
                if (clientId) {
                    throw new err.Unauthorized("invalid_client")
                        .withDeveloperMessage("Client attempted to authenticate with multiple methods")
                        .withReturnAs("json");
                }
                clientId = req.body.client_id;
                clientSecret = req.body.client_secret;
            }
            const client = yield services_1.clientService.getByCode(clientId, tenantCode);
            if (!client) {
                throw new err.Unauthorized("invalid_client")
                    .withDeveloperMessage(`Client ${clientId} not found for tenant ${tenantCode}`)
                    .withReturnAs("json");
            }
            if (client.client_secret !== clientSecret) {
                throw new err.Unauthorized("invalid_client")
                    .withDeveloperMessage(`Mismatched client secret, expected ${client.client_secret} got ${clientSecret}`)
                    .withReturnAs("json");
            }
            if (req.body.grant_type === "authorization_code") {
                const code = yield data_1.codeData.get(req.body.code);
                if (!code) {
                    throw new err.BadRequest("invalid_grant")
                        .withDeveloperMessage(`Unknown code: ${req.body.code}`)
                        .withReturnAs("json");
                }
                data_1.codeData.delete(req.body.code);
                if (code.request.client_id !== clientId) {
                    throw new err.BadRequest("invalid_grant")
                        .withDeveloperMessage(`Client mismatch, expected ${code.request.client_id} got ${clientId}`)
                        .withReturnAs("json");
                }
                const header = { typ: "JWT", alg: rsaKey.alg, kid: rsaKey.kid };
                const access_token = randomstring.generate();
                const refresh_token = randomstring.generate();
                services_1.tokenService.createToken({ access_token, client_id: clientId, scope: code.scope, user: code.user });
                services_1.tokenService.createToken({ refresh_token, client_id: clientId, scope: code.scope, user: code.user });
                console.log("Issuing access token %s", access_token);
                console.log("with scope %s", code.scope);
                let cscope;
                if (code.scope) {
                    cscope = code.scope.join(" ");
                }
                const token_response = { access_token, refresh_token, token_type: "Bearer", scope: cscope };
                if (_.includes(code.scope, "openid")) {
                    const ipayload = {
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
            }
            else if (req.body.grant_type === "refresh_token") {
                const token = yield services_1.tokenService.getRefreshToken(req.body.refresh_token);
                if (!token) {
                    throw new err.BadRequest("invalid_grant")
                        .withDeveloperMessage(`No matching token was found for this refresh token: ${req.body.refresh_token}`)
                        .withReturnAs("json");
                }
                console.log("We found a matching refresh token: %s", req.body.refresh_token);
                if (token.client_id !== clientId) {
                    services_1.tokenService.deleteRefreshToken(req.body.refresh_token);
                    throw new err.BadRequest("invalid_grant")
                        .withDeveloperMessage(`No matching clientId: expected ${token.client_id} got ${clientId}`)
                        .withReturnAs("json");
                }
                const access_token = randomstring.generate();
                services_1.tokenService.createToken({ access_token, client_id: clientId });
                const token_response = { access_token, token_type: "Bearer", refresh_token: token.refresh_token };
                res.status(200).json(token_response);
                return;
            }
            else {
                throw new err.BadRequest("unsupported_grant_type")
                    .withDeveloperMessage(`Unknown grant type ${req.body.grant_type}`)
                    .withReturnAs("json");
            }
        }
        catch (err) {
            next(err);
        }
    }),
    revokeToken: (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const auth = req.headers.authorization;
            let clientId;
            let clientSecret;
            const tenantCode = req.ctx.tenantCode;
            if (!tenantCode) {
                throw new err.ValidationError("Missing tenant")
                    .withDeveloperMessage("There was no tenant code")
                    .withReturnAs("html");
            }
            if (auth) {
                const clientCredentials = decodeClientCredentials(auth);
                clientId = clientCredentials.id;
                clientSecret = clientCredentials.secret;
            }
            if (req.body.client_id) {
                if (clientId) {
                    throw new err.Unauthorized("invalid_client")
                        .withDeveloperMessage("Client attempted to authenticate with multiple methods")
                        .withReturnAs("json");
                }
                clientId = req.body.client_id;
                clientSecret = req.body.client_secret;
            }
            const client = yield services_1.clientService.getByCode(clientId, tenantCode);
            if (!client) {
                throw new err.Unauthorized("invalid_client")
                    .withDeveloperMessage(`Client ${clientId} not found for tenant ${tenantCode}`)
                    .withReturnAs("json");
            }
            if (client.client_secret !== clientSecret) {
                throw new err.Unauthorized("invalid_client")
                    .withDeveloperMessage(`Mismatched client secret, expected ${client.client_secret} got ${clientSecret}`)
                    .withReturnAs("json");
            }
            const inToken = req.body.token;
            const count = yield services_1.tokenService.deleteAccessToken(inToken, clientId);
            console.log("Removed %s tokens", count);
            res.sendStatus(204);
        }
        catch (err) {
            next(err);
        }
    }),
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
