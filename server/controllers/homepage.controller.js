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
exports.homepageController = {
    getHomepage: (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const testUrl = req.protocol + "://" + req.get("host");
            const ip = {};
            ip["x-forwarded-for"] = req.headers["x-forwarded-for"];
            ip["req-ip"] = req.ip;
            ip["req-ips"] = req.ips;
            ip["req-connection-remoteAddress"] = req.connection && req.connection.remoteAddress;
            ip["req-socket-remoteAddress"] = req.socket && req.socket.remoteAddress;
            ip["user-agent"] = req.headers["user-agent"];
            res.json({
                aaa: 222,
                bbb: 333,
            });
        }
        catch (err) {
            next(err);
        }
    }),
};
