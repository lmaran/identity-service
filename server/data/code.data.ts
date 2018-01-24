import { mongoHelper } from "../helpers";

const collection = "codes";
export const codeData = {

    getAll: async () => {
        const db = await mongoHelper.getDb();
        return  await db.collection(collection).find().toArray();
    },

    create: async (code: any) => {
        const db = await mongoHelper.getDb();
        return await db.collection(collection).insertOne(code);
    },

    get: async (id: string) => {
        const db = await mongoHelper.getDb();
        return await db.collection(collection).findOne({ code: id});
    },

    delete: async (id: string) => {
        const db = await mongoHelper.getDb();
        const result = await db.collection(collection).deleteOne({ code: id });
        return result.deletedCount;
    },
};
