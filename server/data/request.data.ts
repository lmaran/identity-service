import { mongoHelper } from "../helpers";

const collection = "requests";
export const requestData = {

    getAll: async () => {
        const db = await mongoHelper.getDb();
        return  await db.collection(collection).find().toArray();
    },

    create: async (request: any) => {
        const db = await mongoHelper.getDb();
        return await db.collection(collection).insertOne(request);
    },

    get: async (id: string) => {
        const db = await mongoHelper.getDb();
        return await db.collection(collection).findOne({ requestId: id});
    },

    delete: async (id: string) => {
        const db = await mongoHelper.getDb();
        const result = await db.collection(collection).deleteOne({ requestId: id });
        return result.deletedCount;
    },
};
