import mongoService from "../util/mongo.service";
import * as _ from "lodash";

const collection = "codes";
export const codeService = {

    getAll: async () => {
        const db = await mongoService.getDb();
        return  await db.collection(collection).find().toArray();
    },

    create: async (code: any) => {
        const db = await mongoService.getDb();
        return await db.collection(collection).insertOne(code);
    },

    get: async (id: string) => {
        const db = await mongoService.getDb();
        return await db.collection(collection).findOne({ code: id});
    },

    delete: async (id: string) => {
        const db = await mongoService.getDb();
        const result = await db.collection(collection).deleteOne({ code: id });
        return result.deletedCount;
    },
};
