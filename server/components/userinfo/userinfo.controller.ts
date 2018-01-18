import { Request, Response } from "express";
import * as _ from "lodash";
// import * as querystring from "querystring";
// import * as randomstring from "randomstring";
// import {requests, codes} from "../shared/data";
// import * as jose from "jsrsasign";
// import * as nosql2 from "nosql";

// const nosql = nosql2.load("database.nosql");

const userinfoController = {

    // GET, POST
    getUserinfo: async (req: Request, res: Response) => {
        if (!_.includes(req.access_token.scope, "openid")) {
            res.status(403).end();
            return;
        }

        const user = req.access_token.user;
        if (!user) {
            res.status(404).end();
            return;
        }

        const out = {};
        _.each(req.access_token.scope, scope => {
            if (scope === "openid") {
                _.each(["sub"], claim => {
                    if (user[claim]) {
                        out[claim] = user[claim];
                    }
                });
            } else if (scope === "profile") {
                _.each(["name", "family_name", "given_name", "middle_name", "nickname", "preferred_username", "profile", "picture", "website", "gender", "birthdate", "zoneinfo", "locale", "updated_at"], function (claim) {
                    if (user[claim]) {
                        out[claim] = user[claim];
                    }
                });
            } else if (scope === "email") {
                _.each(["email", "email_verified"], claim => {
                    if (user[claim]) {
                        out[claim] = user[claim];
                    }
                });
            } else if (scope === "address") {
                _.each(["address"], claim => {
                    if (user[claim]) {
                        out[claim] = user[claim];
                    }
                });
            } else if (scope === "phone") {
                _.each(["phone_number", "phone_number_verified"], claim => {
                    if (user[claim]) {
                        out[claim] = user[claim];
                    }
                });
            }
        });

        // const out = {test: 1234};
        res.status(200).json(out);
        return;
    },

};

export default userinfoController;
