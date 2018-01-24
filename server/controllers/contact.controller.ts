import { Request, Response } from "express";

export const contactController = {

    getContactPage: async (req: Request, res: Response) => {
        res.send("Contact page for Identity Service");
    },

};
