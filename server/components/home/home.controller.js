"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../helpers");
const homeController = {
    getHomePage: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const subdomains = req.subdomains;
        let envSubdomain = "noEnv";
        let appSubdomain = "noApp";
        if (subdomains) {
            if (subdomains.length > 0 && subdomains.length < 4) {
                if (subdomains[0] === "identity") {
                    if (subdomains.length === 1) {
                        envSubdomain = "prod";
                    }
                    if (subdomains.length === 2) {
                        const s = subdomains[1];
                        if (isReservedSubdomain(s)) {
                            envSubdomain = s;
                        }
                        else {
                            appSubdomain = s;
                        }
                    }
                    if (subdomains.length === 3) {
                        const s = subdomains[1];
                        if (isReservedSubdomain(s)) {
                            envSubdomain = s;
                            appSubdomain = subdomains[2];
                        }
                    }
                }
            }
        }
        res.send(`Hello Identity Service for ${appSubdomain} (${envSubdomain})`);
    }),
};
function isReservedSubdomain(subdomain) {
    const isReserved1 = ["stg", "temp", "temp-stg", "blue", "blue-stg", "green", "green-stg", "dev"].includes(subdomain);
    const isReserved2 = helpers_1.strEndsWithValueFromList(subdomain, ["-blue", "-green", "-blue-stg", "-green-stg"]);
    return isReserved1 || isReserved2;
}
exports.default = homeController;
