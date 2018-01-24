import { mongoHelper } from "../helpers";

const collection = "tokens";
export const tokenData = {

    getAll: async () => {
        const db = await mongoHelper.getDb();
        return  await db.collection(collection).find().toArray();
    },

    // // ---------- CRUD ----------
    // getById: async (id: any) => {
    //     const db = await mongoService.getDb();
    //     id = mongoService.normalizedId(id);
    //     return await db.collection(collection).findOne({ _id: id });
    // },

    createToken: async (token: any) => {
        const db = await mongoHelper.getDb();
        return await db.collection(collection).insertOne(token);
    },

    getAccessToken: async (token: string) => {
        const db = await mongoHelper.getDb();
        return await db.collection(collection).findOne({ access_token: token });
    },

    getRefreshToken: async (token: string) => {
        const db = await mongoHelper.getDb();
        return await db.collection(collection).findOne({ refresh_token: token });
    },

    deleteAccessToken: async (token, clientId) => {
        const db = await mongoHelper.getDb();
        const result = await db.collection(collection).deleteOne({ access_token: token, client_id: clientId });
        return result.deletedCount;
    },

    deleteRefreshToken: async (token: string) => {
        const db = await mongoHelper.getDb();
        const result = await db.collection(collection).deleteOne({ refresh_token: token });
        return result.deletedCount;
    },
};
