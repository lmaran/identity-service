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
const token_dal_1 = require("./token.dal");
const tokenService = {
    getAll: () => __awaiter(this, void 0, void 0, function* () {
        const tokens = yield token_dal_1.default.getAll();
        return (tokens);
    }),
    createToken: (token) => __awaiter(this, void 0, void 0, function* () {
        return yield token_dal_1.default.createToken(token);
    }),
    getAccessToken: (token) => __awaiter(this, void 0, void 0, function* () {
        const tokenInfo = yield token_dal_1.default.getAccessToken(token);
        return tokenInfo;
    }),
    getRefreshToken: (token) => __awaiter(this, void 0, void 0, function* () {
        const tokenInfo = yield token_dal_1.default.getRefreshToken(token);
        return tokenInfo;
    }),
    deleteAccessToken: (token, clientId) => __awaiter(this, void 0, void 0, function* () {
        const deletedCount = yield token_dal_1.default.deleteAccessToken(token, clientId);
        return deletedCount;
    }),
    deleteRefreshToken: (token) => __awaiter(this, void 0, void 0, function* () {
        const deletedCount = yield token_dal_1.default.deleteRefreshToken(token);
        return deletedCount;
    }),
};
exports.default = tokenService;
