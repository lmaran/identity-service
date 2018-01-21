import mongoService from "../util/mongo.service";
import * as _ from "lodash";

const collection = "requests";
export const requestService = {

    getAll: async () => {
        const db = await mongoService.getDb();

        return  await db.collection(collection).find().toArray();
    },

    create: async (request: any) => {
        const db = await mongoService.getDb();
        return await db.collection(collection).insertOne(request);
    },

    get: async (id: string) => {
        const db = await mongoService.getDb();
        return await db.collection(collection).findOne({ requestId: id});
    },

    delete: async (id: string) => {
        const db = await mongoService.getDb();
        const result = await db.collection(collection).deleteOne({ requestId: id });
        return result.deletedCount;
    },
};
