import mongoService from "../../util/mongo.service";
import { IClient } from "@interfaces";
import * as _ from "lodash";

const collection = "clients";
const clientDal = {

    getAll: async () => {
        const db = await mongoService.getDb();

        return  await db.collection(collection).find().toArray();
    },

    // // ---------- CRUD ----------
    getById: async (id: any) => {
        const db = await mongoService.getDb();
        id = mongoService.normalizedId(id);
        return await db.collection(collection).findOne({ _id: id });
    },

    getClient: async (clientId: string) => {
        // return _.find(clients, client => client.client_id === clientId);
        const db = await mongoService.getDb();
        return await db.collection(collection).findOne({ client_id: clientId });
    },

};

export default clientDal;
