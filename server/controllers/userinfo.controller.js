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
const _ = require("lodash");
exports.userinfoController = {
    getUserinfo: (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
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
                }
                else if (scope === "profile") {
                    _.each(["name", "family_name", "given_name", "middle_name", "nickname", "preferred_username", "profile", "picture", "website", "gender", "birthdate", "zoneinfo", "locale", "updated_at"], claim => {
                        if (user[claim]) {
                            out[claim] = user[claim];
                        }
                    });
                }
                else if (scope === "email") {
                    _.each(["email", "email_verified"], claim => {
                        if (user[claim]) {
                            out[claim] = user[claim];
                        }
                    });
                }
                else if (scope === "address") {
                    _.each(["address"], claim => {
                        if (user[claim]) {
                            out[claim] = user[claim];
                        }
                    });
                }
                else if (scope === "phone") {
                    _.each(["phone_number", "phone_number_verified"], claim => {
                        if (user[claim]) {
                            out[claim] = user[claim];
                        }
                    });
                }
            });
            res.status(200).json(out);
            return;
        }
        catch (err) {
            next(err);
        }
    }),
};
