import { mongoHelper } from "../helpers";

const collection = "tenants";
export const clientData = {

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

    getTenant: async (tenantCode: string) => {
        // return _.find(clients, client => client.client_id === clientId);
        const db = await mongoHelper.getDb();
        return await db.collection(collection).findOne({ tenantCode });
    },

};
