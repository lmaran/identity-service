import { Request, Response } from "express";

const contactController = {

    getContactPage: async (req: Request, res: Response) => {
        res.send("Contact page for Identity Service");
    },

};

export default contactController;
