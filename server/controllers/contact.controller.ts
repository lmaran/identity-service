import { Request, Response, NextFunction } from "express";

export const contactController = {

    getContactPage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.send("Contact page for Identity Service");
        } catch (err) {
            next(err);
        }
    },

};
