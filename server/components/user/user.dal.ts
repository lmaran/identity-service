import mongoService from "../../util/mongo.service";
import { IUser } from "@interfaces";

const collection = "users";
const userDal = {

    getAll: async () => {
        const db = await mongoService.getDb();

        return  await db.collection(collection).find().toArray();
    },

    // ---------- CRUD ----------
    getById: async (id: any) => {
        const db = await mongoService.getDb();
        id = mongoService.normalizedId(id);
        return await db.collection(collection).findOne({ _id: id });
    },

    getUser: async (userName: string) => {
        const db = await mongoService.getDb();
        return await db.collection(collection).findOne({ userId: userName });
    },

    getUserByEmail: async (email: string) => {
        const db = await mongoService.getDb();
        return await db.collection(collection).findOne({ email });
    },
};

export default userDal;
