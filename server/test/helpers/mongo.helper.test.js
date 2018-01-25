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
const mongodb_1 = require("mongodb");
const chai_1 = require("chai");
const helpers_1 = require("../../helpers");
const config_1 = require("../../config");
describe("Mongo service", () => {
    let db;
    it("should have the right database in place", () => __awaiter(this, void 0, void 0, function* () {
        if (config_1.default.mongo) {
            config_1.default.mongo.uri = "mongodb://localhost";
        }
        helpers_1.mongoHelper.removeDbFromCache();
        try {
            db = yield helpers_1.mongoHelper.getDb();
            const adminDb = db.admin();
            const dbs = yield adminDb.listDatabases();
            if (config_1.default.env === "development") {
                chai_1.expect(dbs.databases.some((item) => item.name === "identity-service-dev")).to.be.true;
            }
        }
        catch (err) {
            chai_1.expect(err).to.be.null;
        }
    }));
    it("should have all collections in place", () => __awaiter(this, void 0, void 0, function* () {
        if (config_1.default.mongo) {
            config_1.default.mongo.uri = "mongodb://localhost/identity-service-dev";
        }
        helpers_1.mongoHelper.removeDbFromCache();
        try {
            db = yield helpers_1.mongoHelper.getDb();
            console.log(db.databaseName);
            const collections = yield db.listCollections().toArray();
            chai_1.expect(collections.some(item => item.name === "users")).to.be.true;
        }
        catch (err) {
            chai_1.expect(err).to.be.not.null;
            console.log(err.message);
            chai_1.expect(err.message).contains("failed to connect to server");
        }
    }));
    it("should connect to the database (for correct uri)", () => __awaiter(this, void 0, void 0, function* () {
        if (config_1.default.mongo) {
            config_1.default.mongo.uri = "mongodb://localhost/identity-service-dev";
        }
        helpers_1.mongoHelper.removeDbFromCache();
        try {
            db = yield helpers_1.mongoHelper.getDb();
            const xxx = yield db.serverConfig.connections();
            console.log(db.databaseName);
            console.log(xxx.length);
        }
        catch (err) {
            chai_1.expect(err).to.be.not.null;
            console.log(err.message);
            chai_1.expect(err.message).contains("failed to connect to server");
        }
    }));
    it("should respond with an error object (for incorrect uri)", () => __awaiter(this, void 0, void 0, function* () {
        if (config_1.default.mongo) {
            config_1.default.mongo.uri = "mongodb3://localhost/identity-service-dev";
        }
        helpers_1.mongoHelper.removeDbFromCache();
        try {
            db = yield helpers_1.mongoHelper.getDb();
        }
        catch (err) {
            chai_1.expect(err).to.be.not.null;
        }
    }));
    it("should respond with an error object (for missing uri)", () => __awaiter(this, void 0, void 0, function* () {
        if (config_1.default.mongo) {
            config_1.default.mongo.uri = undefined;
        }
        helpers_1.mongoHelper.removeDbFromCache();
        try {
            db = yield helpers_1.mongoHelper.getDb();
        }
        catch (err) {
            chai_1.expect(err).to.be.not.null;
            chai_1.expect(err.message).equal("Error: Nu este definit un connection string pentru Mongo.");
        }
    }));
    it("should respond with a cached DB instance (for correct uri)", () => __awaiter(this, void 0, void 0, function* () {
        if (config_1.default.mongo) {
            config_1.default.mongo.uri = "mongodb://localhost/identity-service-dev";
        }
        helpers_1.mongoHelper.removeDbFromCache();
        try {
            db = yield helpers_1.mongoHelper.getDb();
            const db2 = yield helpers_1.mongoHelper.getDb();
            chai_1.expect(db2).equal(db);
        }
        catch (err) {
            chai_1.expect(err).to.be.null;
        }
    }));
    it("should return a correct normalized value", () => {
        chai_1.expect(helpers_1.mongoHelper.normalizedId("5780eb7c9b711a3e2c1bc2d5")).deep.equal(new mongodb_1.ObjectID("5780eb7c9b711a3e2c1bc2d5"));
        chai_1.expect(helpers_1.mongoHelper.normalizedId("aaa")).equal("aaa");
    });
});
