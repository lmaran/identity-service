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
exports.tokenService = {
    getAll: () => __awaiter(this, void 0, void 0, function* () {
        const tokens = yield data_1.tokenData.getAll();
        return (tokens);
    }),
    createToken: (token) => __awaiter(this, void 0, void 0, function* () {
        return yield data_1.tokenData.createToken(token);
    }),
    getAccessToken: (token) => __awaiter(this, void 0, void 0, function* () {
        const tokenInfo = yield data_1.tokenData.getAccessToken(token);
        return tokenInfo;
    }),
    getRefreshToken: (token) => __awaiter(this, void 0, void 0, function* () {
        const tokenInfo = yield data_1.tokenData.getRefreshToken(token);
        return tokenInfo;
    }),
    deleteAccessToken: (token, clientId) => __awaiter(this, void 0, void 0, function* () {
        const deletedCount = yield data_1.tokenData.deleteAccessToken(token, clientId);
        return deletedCount;
    }),
    deleteRefreshToken: (token) => __awaiter(this, void 0, void 0, function* () {
        const deletedCount = yield data_1.tokenData.deleteRefreshToken(token);
        return deletedCount;
    }),
};
