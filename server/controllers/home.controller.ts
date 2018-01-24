import { Request, Response } from "express";
import { stringHelper } from "../helpers";

export const homeController = {

    getHomePage: async (req: Request, res: Response) => {

        // Host: "http://app1.dev.identity.appstudio.ro/" => ["identity", "dev", "app1"]
        const subdomains = req.subdomains;
        let envSubdomain = "noEnv";
        let appSubdomain = "noApp";

        if (subdomains) {
            if (subdomains.length > 0 && subdomains.length < 4) {
                if (subdomains[0] === "identity") {
                    if (subdomains.length === 1) { // ["identity"]
                        envSubdomain = "prod";
                    }
                    if (subdomains.length === 2) { // ["identity", "dev"] or ["identity", app1"]
                        const s = subdomains[1];
                        if (isReservedSubdomain(s)) {
                            envSubdomain = s;
                        } else {
                            appSubdomain = s;
                        }
                    }
                    if (subdomains.length === 3) { // ["identity", "dev", app1"]
                        const s = subdomains[1];
                        if (isReservedSubdomain(s)) {
                            envSubdomain = s;
                            appSubdomain = subdomains[2];
                        } // else wrong env
                    }
                } // else localhost or wrong app
            } // else localhost or wrong app
        }

        res.send(`Hello Identity Service for ${appSubdomain} (${envSubdomain})`);
    },

};

function isReservedSubdomain(subdomain) {
    const isReserved1 = ["stg", "temp", "temp-stg", "blue", "blue-stg", "green", "green-stg", "dev"].includes(subdomain);
    const isReserved2 = stringHelper.endsWithValueFromList(subdomain, ["-blue", "-green", "-blue-stg", "-green-stg"]);
    return isReserved1 || isReserved2;
}
