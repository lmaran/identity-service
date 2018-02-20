import { Request, Response, NextFunction } from "express";

export const homepageController = {

    // GET
    getHomepage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const testUrl = req.protocol + "://" + req.get("host");

            // https://stackoverflow.com/a/10849772
            const ip = {};
            ip["x-forwarded-for"] = req.headers["x-forwarded-for"];
            ip["req-ip"] = req.ip; // https://expressjs.com/en/api.html#req.ip, https://stackoverflow.com/a/42749743
            ip["req-ips"] = req.ips; // https://expressjs.com/en/api.html#req.ips
            ip["req-connection-remoteAddress"] = req.connection && req.connection.remoteAddress;
            ip["req-socket-remoteAddress"] = req.socket && req.socket.remoteAddress;
            ip["user-agent"] = req.headers["user-agent"];

            // res.render("homepage", { testUrl, ip });
            res.json({
                aaa: 222,
                bbb: 333,
            });
        } catch (err) {
            next(err);
        }
    },

};
