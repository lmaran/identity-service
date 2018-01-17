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
const _ = require("lodash");
const collection = "clients";
const clientDal = {
    getAll: () => __awaiter(this, void 0, void 0, function* () {
        const db = yield mongo_service_1.default.getDb();
        return yield db.collection(collection).find().toArray();
    }),
    getById: (id) => __awaiter(this, void 0, void 0, function* () {
        const db = yield mongo_service_1.default.getDb();
        id = mongo_service_1.default.normalizedId(id);
        return yield db.collection(collection).findOne({ _id: id });
    }),
    getClient: (clientId) => {
        return _.find(clients, client => client.client_id === clientId);
    },
};
const clients = [
    {
        client_id: "oauth-client-1",
        client_secret: "oauth-client-secret-1",
        redirect_uris: ["http://localhost:1412/callback"],
        scope: "openid profile email phone address",
    },
];
exports.default = clientDal;
