import { mongoHelper } from "../helpers";

const collection = "clients";
export const clientData = {

    getByCode: async (clientId: string, tenantCode: string) => {
        const db = await mongoHelper.getDb();
        return await db.collection(collection).findOne({ client_id: clientId, tenantCode });
    },

};
