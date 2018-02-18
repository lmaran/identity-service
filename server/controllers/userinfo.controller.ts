import { Request, Response, NextFunction } from "express";
import * as _ from "lodash";
import * as err from "../errors";
// import { OAuthAuthorizationError, ReturnAs } from "../constants";

export const userinfoController = {

    // GET, POST
    getUserinfo: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!_.includes(req.ctx.accessToken.scope, "openid")) {
                // res.status(403).end();
                // return;
                throw new err.Forbidden().withDeveloperMessage("There was no 'openid' scope in accessToken");
            }

            const user = req.ctx.accessToken.user;
            if (!user) {
                // res.status(404).end();
                // return;
                throw new err.NotFoundError().withDeveloperMessage("There was no 'user' field in accessToken");
            }

            const out = {};
            _.each(req.ctx.accessToken.scope, scope => {
                if (scope === "openid") {
                    _.each(["sub"], claim => {
                        if (user[claim]) {
                            out[claim] = user[claim];
                        }
                    });
                } else if (scope === "profile") {
                    _.each(["name", "family_name", "given_name", "middle_name", "nickname", "preferred_username", "profile", "picture", "website", "gender", "birthdate", "zoneinfo", "locale", "updated_at"], claim => {
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

            res.status(200).json(out);
            return;
        } catch (err) {
            next(err);
        }
    },

};
