import config from "../config";
import { MongoClient, ObjectID, Db } from "mongodb";

let theDb: Db | null; // this will be re-used so the db is only created once (on first request).
const service = {

    getDb: async () => {
        try {
            if (!theDb) {
                // console.log("no db...");
                if (!config.mongo || !config.mongo.uri) {
                    throw new Error("Nu este definit un connection string pentru Mongo.");
                }
                const client = await MongoClient.connect(config.mongo.uri, config.mongo.options);
                const db = client.db("identity-service-dev");

                theDb = db;
                return db;
            } else { // db already exists...
                return theDb;
            }
        } catch (error) {
            console.log("Caught", error.message);
            throw new Error(error);
        }
    },

    // used by some tests
    removeDbFromCache: () => {
        theDb = null;
    },

    normalizedId: (id: any) => {
        if (ObjectID.isValid(id)) {
            return new ObjectID(id);
        } else { return id; }
    },

    // // read
    // getById: function (collection, id, next) {
    //     this.getDb(function (err, db) {
    //         if (err) { return next(err, null); }
    //         id = service.normalizedId(id);
    //         db.collection(collection).findOne({ _id: id }, next);
    //     });
    // }

    // config: config

};

export default service;
