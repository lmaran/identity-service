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
const collection = "codes";
exports.codeData = {
    getAll: () => __awaiter(this, void 0, void 0, function* () {
        const db = yield helpers_1.mongoHelper.getDb();
        return yield db.collection(collection).find().toArray();
    }),
    create: (code) => __awaiter(this, void 0, void 0, function* () {
        const db = yield helpers_1.mongoHelper.getDb();
        return yield db.collection(collection).insertOne(code);
    }),
    get: (id) => __awaiter(this, void 0, void 0, function* () {
        const db = yield helpers_1.mongoHelper.getDb();
        return yield db.collection(collection).findOne({ code: id });
    }),
    delete: (id) => __awaiter(this, void 0, void 0, function* () {
        const db = yield helpers_1.mongoHelper.getDb();
        const result = yield db.collection(collection).deleteOne({ code: id });
        return result.deletedCount;
    }),
};
