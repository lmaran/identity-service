import { mongoHelper } from "../helpers";

const collection = "tenants";
export const clientData = {

    getByCode: async (tenantCode: string) => {
        // return _.find(clients, client => client.client_id === clientId);
        const db = await mongoHelper.getDb();
        return await db.collection(collection).findOne({ tenantCode });
    },

};
