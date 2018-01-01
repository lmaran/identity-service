import { Request, Response } from "express";

const homeController = {

    getHomePage: async (req: Request, res: Response) => {

        // Host: "http://app1.dev.identity.appstudio.ro/" => ["identity", "dev", "app1"]
        const subdomains = req.subdomains;
        let envSubdomain = "noEnv";
        let appSubdomain = "noApp";

        if (subdomains) {
            if (subdomains.length == 0 || subdomains.length > 3) {
                // maybe localhost, wrong app or wring subdomain(s)
            } else {
                if (subdomains[0] === "identity") {
                    if (subdomains.length == 1) { // ["identity"]
                        envSubdomain = "prod";
                    }
                    if (subdomains.length == 2) { // ["identity", "dev"] or ["identity", app1"]
                        const s = subdomains[1];
                        if (s == "stg" || s == "temp" || s == "temp-stg" || s == "dev") {
                            envSubdomain = s;
                        } else {
                            appSubdomain = s;
                        }
                    }
                    if (subdomains.length == 3) { // ["identity", "dev", app1"]
                        const s = subdomains[1];
                        if (s == "stg" || s == "temp" || s == "temp-stg" || s == "dev") {
                            envSubdomain = s;
                            appSubdomain = subdomains[2];
                        } // else wrong env
                    }
                } // else localhost or wrong app
            }
        }


        res.send(`Hello Identity Service for ${appSubdomain} (${envSubdomain})`);
    },

};

export default homeController;