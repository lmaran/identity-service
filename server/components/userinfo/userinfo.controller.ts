import { Request, Response } from "express";
import * as __ from "underscore";
// import * as querystring from "querystring";
// import * as randomstring from "randomstring";
// import {requests, codes} from "../shared/data";
// import * as jose from "jsrsasign";
// import * as nosql2 from "nosql";

// const nosql = nosql2.load("database.nosql");

const userinfoController = {

    // POST
    getUserinfo: async (req: Request, res: Response) => {
        if (!__.contains(req.access_token.scope, "openid")) {
            res.status(403).end();
            return;
        }

        const user = req.access_token.user;
        if (!user) {
            res.status(404).end();
            return;
        }

        const out = {};
        __.each(req.access_token.scope, scope => {
            if (scope === "openid") {
                __.each(["sub"], claim => {
                    if (user[claim]) {
                        out[claim] = user[claim];
                    }
                });
            } else if (scope === "profile") {
                __.each(["name", "family_name", "given_name", "middle_name", "nickname", "preferred_username", "profile", "picture", "website", "gender", "birthdate", "zoneinfo", "locale", "updated_at"], function (claim) {
                    if (user[claim]) {
                        out[claim] = user[claim];
                    }
                });
            } else if (scope === "email") {
                __.each(["email", "email_verified"], claim => {
                    if (user[claim]) {
                        out[claim] = user[claim];
                    }
                });
            } else if (scope === "address") {
                __.each(["address"], claim => {
                    if (user[claim]) {
                        out[claim] = user[claim];
                    }
                });
            } else if (scope === "phone") {
                __.each(["phone_number", "phone_number_verified"], claim => {
                    if (user[claim]) {
                        out[claim] = user[claim];
                    }
                });
            }
        });

        // const out = {test: 1234};
        res.status(200).json(out);
        return;
    },

};

// // client information
// const clients = [
//     {
//         client_id: "oauth-client-1",
//         client_secret: "oauth-client-secret-1",
//         redirect_uris: ["http://localhost:1412/callback"],
//         scope: "openid profile email phone address",
//     },
// ];

// const getClient = clientId => {
//     return __.find(clients, client => client.client_id === clientId);
// };

// const decodeClientCredentials = auth => {
//     const clientCredentials = new Buffer(auth.slice("basic ".length), "base64").toString().split(":");
//     const clientId = querystring.unescape(clientCredentials[0]);
//     const clientSecret = querystring.unescape(clientCredentials[1]);
//     return { id: clientId, secret: clientSecret };
// };

// const rsaKey = {
//     alg: "RS256",
//     d: "ZXFizvaQ0RzWRbMExStaS_-yVnjtSQ9YslYQF1kkuIoTwFuiEQ2OywBfuyXhTvVQxIiJqPNnUyZR6kXAhyj__wS_Px1EH8zv7BHVt1N5TjJGlubt1dhAFCZQmgz0D-PfmATdf6KLL4HIijGrE8iYOPYIPF_FL8ddaxx5rsziRRnkRMX_fIHxuSQVCe401hSS3QBZOgwVdWEb1JuODT7KUk7xPpMTw5RYCeUoCYTRQ_KO8_NQMURi3GLvbgQGQgk7fmDcug3MwutmWbpe58GoSCkmExUS0U-KEkHtFiC8L6fN2jXh1whPeRCa9eoIK8nsIY05gnLKxXTn5-aPQzSy6Q",
//     e: "AQAB",
//     n: "p8eP5gL1H_H9UNzCuQS-vNRVz3NWxZTHYk1tG9VpkfFjWNKG3MFTNZJ1l5g_COMm2_2i_YhQNH8MJ_nQ4exKMXrWJB4tyVZohovUxfw-eLgu1XQ8oYcVYW8ym6Um-BkqwwWL6CXZ70X81YyIMrnsGTyTV6M8gBPun8g2L8KbDbXR1lDfOOWiZ2ss1CRLrmNM-GRp3Gj-ECG7_3Nx9n_s5to2ZtwJ1GS1maGjrSZ9GRAYLrHhndrL_8ie_9DS2T-ML7QNQtNkg2RvLv4f0dpjRYI23djxVtAylYK4oiT_uEMgSkc4dxwKwGuBxSO0g9JOobgfy0--FUHHYtRi0dOFZw",
//     kty: "RSA",
//     kid: "authserver",
// };

export default userinfoController;
