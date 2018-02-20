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
const config_1 = require("../config");
const mongodb_1 = require("mongodb");
let theDb;
exports.mongoHelper = {
    getDb: () => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!theDb) {
                if (!config_1.default.mongo || !config_1.default.mongo.uri) {
                    throw new Error("Nu este definit un connection string pentru Mongo.");
                }
                if (!config_1.default.mongo || !config_1.default.mongo.dbName) {
                    throw new Error("Nu este definit numele bazei de date.");
                }
                const client = yield mongodb_1.MongoClient.connect(config_1.default.mongo.uri, config_1.default.mongo.options);
                const db = client.db(config_1.default.mongo.dbName);
                theDb = db;
                return db;
            }
            else {
                return theDb;
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }),
    removeDbFromCache: () => {
        theDb = null;
    },
    normalizedId: (id) => {
        if (mongodb_1.ObjectID.isValid(id)) {
            return new mongodb_1.ObjectID(id);
        }
        else {
            return id;
        }
    },
};
