import { Request, Response } from "express";
import clientService from "../client/client.service";

const approveController = {

    // GET
    getHomepage: async (req: Request, res: Response) => {
        const clients = await clientService.getAll();
        res.render("../components/homepage/index", { clients, authServer });
    },

};

// authorization server information
const authServer = {
    authorizationEndpoint: "http://localhost:1420/authorize",
    tokenEndpoint: "http://localhost:1420/token",
};

export default approveController;
