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
const data_1 = require("../data");
exports.userService = {
    getAll: () => __awaiter(this, void 0, void 0, function* () {
        const users = yield data_1.userData.getAll();
        return (users);
    }),
    getUser: (userName, tenantCode) => __awaiter(this, void 0, void 0, function* () {
        const user = yield data_1.userData.getUser(userName, tenantCode);
        return (user);
    }),
    getUserByEmail: (email, tenantCode) => __awaiter(this, void 0, void 0, function* () {
        const user = yield data_1.userData.getUserByEmail(email, tenantCode);
        return (user);
    }),
};
