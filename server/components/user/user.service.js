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
const user_dal_1 = require("./user.dal");
const userService = {
    getAll: () => __awaiter(this, void 0, void 0, function* () {
        const users = yield user_dal_1.default.getAll();
        return (users);
    }),
    getById: (id) => __awaiter(this, void 0, void 0, function* () {
        const user = yield user_dal_1.default.getById(id);
        return (user);
    }),
};
exports.default = userService;
