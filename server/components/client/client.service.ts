import clientDal from "./client.dal";
import { IClient } from "@interfaces";

const clientService = {

    // getAll: async () => {
    //     const clients = await clientDal.getAll();
    //     return(clients);
    // },

    getById: async (id: string) => {
        const client = await clientDal.getById(id);
        return(client);
    },

    getClient: (id: string): IClient => {
        const client = clientDal.getClient(id);
        return(client);
    },

};

export default clientService;
