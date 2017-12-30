import { expect } from "chai";
import * as chai from "chai";
import * as sinon from "sinon";

import mongoService from "./mongo.service";
import config, { EnvironmentType } from "../config";
import { ObjectID, Db } from "mongodb";

describe("Mongo service", function () {

    let db: Db;

    it("should have the right database in place", async () => {
        config.mongo.uri = "mongodb://localhost";
        mongoService.removeDbFromCache();
        try {

            db = await mongoService.getDb();

            // Use the admin database for the operation
            const adminDb = db.admin();

            const dbs = await adminDb.listDatabases();

            if (config.env === EnvironmentType.DEVELOPMENT) {
                expect(dbs.databases.some((item: IDBDatabase) => item.name == "identity-service-dev")).to.be.true;
            }


        } catch (err) {
            expect(err).to.be.null;
        }
    });

    it("should have all collections in place", async () => {
        config.mongo.uri = "mongodb://localhost/identity-service-dev";
        mongoService.removeDbFromCache();
        try {

            db = await mongoService.getDb();
            console.log(db.databaseName);


            const collections = await db.listCollections().toArray();
            expect(collections.some((item) => item.name == "users")).to.be.true;
            // expect(collections).to.deep.include({ name: "users" }); // don't work with incomplete properties

        } catch (err) {
            // // that's because we can't annotate the type of the caught object: https://stackoverflow.com/a/45380550
            // const err: MongoError = _err;
            expect(err).to.be.not.null;
            console.log(err.message);
            // expect(err.message).equal("Error: Nu este definit un connection string pentru Mongo.");
            expect(err.message).contains("failed to connect to server");
        }
    });

    it("should connect to the database (for correct uri)", async () => {
        config.mongo.uri = "mongodb://localhost/identity-service-dev";
        mongoService.removeDbFromCache();
        try {

            db = await mongoService.getDb();
            const xxx = await db.serverConfig.connections();
            console.log(db.databaseName);
            console.log(xxx.length);
            // const collections = await db.listCollections({name: "users"}).toArray();
            // expect(collections[0].name).equal("users");
            // expect(db.databaseName).equal("identity-service-dev");
        } catch (err) {
            // // that's because we can't annotate the type of the caught object: https://stackoverflow.com/a/45380550
            // const err: MongoError = _err;
            expect(err).to.be.not.null;
            console.log(err.message);
            // expect(err.message).equal("Error: Nu este definit un connection string pentru Mongo.");
            expect(err.message).contains("failed to connect to server");
        }

    });

    it("should respond with an error object (for incorrect uri)", async () => {
        config.mongo.uri = "mongodb3://localhost/identity-service-dev";
        mongoService.removeDbFromCache();
        try {
            db = await mongoService.getDb();
        } catch (err) {
            expect(err).to.be.not.null;
            expect(err.message).equal("Error: invalid schema, expected mongodb");
        }
    });

    it("should respond with an error object (for missing uri)", async () => {
        config.mongo.uri = undefined;
        mongoService.removeDbFromCache();
        try {
            db = await mongoService.getDb();
        } catch (err) {
            expect(err).to.be.not.null;
            expect(err.message).equal("Error: Nu este definit un connection string pentru Mongo.");
        }
    });

    it("should respond with a cached DB instance (for correct uri)", async () => {
        config.mongo.uri = "mongodb://localhost/identity-service-dev";
        mongoService.removeDbFromCache();
        try {
            db = await mongoService.getDb();
            const db2 = await mongoService.getDb();
            expect(db2).equal(db);
        } catch (err) {
            expect(err).to.be.null;
        }
    });


    it("should return a correct normalized value", () => {
        // check for valid ObjectID
        expect(mongoService.normalizedId("5780eb7c9b711a3e2c1bc2d5")).deep.equal(new ObjectID("5780eb7c9b711a3e2c1bc2d5"));

         // check for invalid ObjectID
        expect(mongoService.normalizedId("aaa")).equal("aaa");
    });

});