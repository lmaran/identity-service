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
const mongo_service_1 = require("../../util/mongo.service");
const collection = "tokens";
const tokenDal = {
    getAll: () => __awaiter(this, void 0, void 0, function* () {
        const db = yield mongo_service_1.default.getDb();
        return yield db.collection(collection).find().toArray();
    }),
    createToken: (token) => __awaiter(this, void 0, void 0, function* () {
        const db = yield mongo_service_1.default.getDb();
        return yield db.collection(collection).insertOne(token);
    }),
    getAccessToken: (token) => __awaiter(this, void 0, void 0, function* () {
        const db = yield mongo_service_1.default.getDb();
        return yield db.collection(collection).findOne({ access_token: token });
    }),
    getRefreshToken: (token) => __awaiter(this, void 0, void 0, function* () {
        const db = yield mongo_service_1.default.getDb();
        return yield db.collection(collection).findOne({ refresh_token: token });
    }),
    deleteAccessToken: (token, clientId) => __awaiter(this, void 0, void 0, function* () {
        const db = yield mongo_service_1.default.getDb();
        const result = yield db.collection(collection).deleteOne({ access_token: token, client_id: clientId });
        return result.deletedCount;
    }),
    deleteRefreshToken: (token) => __awaiter(this, void 0, void 0, function* () {
        const db = yield mongo_service_1.default.getDb();
        const result = yield db.collection(collection).deleteOne({ refresh_token: token });
        return result.deletedCount;
    }),
};
exports.default = tokenDal;
