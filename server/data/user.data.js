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
const helpers_1 = require("../helpers");
const collection = "users";
exports.userData = {
    getAll: () => __awaiter(this, void 0, void 0, function* () {
        const db = yield helpers_1.mongoHelper.getDb();
        return yield db.collection(collection).find().toArray();
    }),
    getById: (id) => __awaiter(this, void 0, void 0, function* () {
        const db = yield helpers_1.mongoHelper.getDb();
        id = helpers_1.mongoHelper.normalizedId(id);
        return yield db.collection(collection).findOne({ _id: id });
    }),
    getUser: (userName) => __awaiter(this, void 0, void 0, function* () {
        const db = yield helpers_1.mongoHelper.getDb();
        return yield db.collection(collection).findOne({ userId: userName });
    }),
    getUserByEmail: (email) => __awaiter(this, void 0, void 0, function* () {
        const db = yield helpers_1.mongoHelper.getDb();
        return yield db.collection(collection).findOne({ email });
    }),
};
