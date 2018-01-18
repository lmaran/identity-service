import { Request, Response } from "express";
import clientService from "../client/client.service";

const approveController = {

    // GET
    getHomepage: async (req: Request, res: Response) => {
        const clients = await clientService.getAll();

        const testUrl = req.protocol + "://" + req.get("host");

        res.render("../components/homepage/index", { clients, authServer, testUrl });
    },

};

// authorization server information
const authServer = {
    authorizationEndpoint: "http://localhost:1420/authorize",
    tokenEndpoint: "http://localhost:1420/token",
};

export default approveController;
