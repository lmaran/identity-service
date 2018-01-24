import { mongoHelper } from "../helpers";

const collection = "users";
export const userData = {

    getAll: async () => {
        const db = await mongoHelper.getDb();
        return  await db.collection(collection).find().toArray();
    },

    // ---------- CRUD ----------
    getById: async (id: any) => {
        const db = await mongoHelper.getDb();
        id = mongoHelper.normalizedId(id);
        return await db.collection(collection).findOne({ _id: id });
    },

    getUser: async (userName: string) => {
        const db = await mongoHelper.getDb();
        return await db.collection(collection).findOne({ userId: userName });
    },

    getUserByEmail: async (email: string) => {
        const db = await mongoHelper.getDb();
        return await db.collection(collection).findOne({ email });
    },
};
