import { Request, Response } from "express";
// import * as __ from "underscore";
// import * as __string from "underscore.string";
// import * as url from "url";
// import * as randomstring from "randomstring";
// import {requests, codes} from "../shared/data";

const approveController = {

    // GET
    getHomepage: async (req: Request, res: Response) => {
        res.render("../components/homepage/index", { clients, authServer });
    },

};

// authorization server information
const authServer = {
    authorizationEndpoint: "http://localhost:1420/authorize",
    tokenEndpoint: "http://localhost:1420/token",
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

export default approveController;
