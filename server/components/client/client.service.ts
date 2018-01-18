import clientDal from "./client.dal";
import { IClient } from "@interfaces";

const clientService = {

    getAll: async (): Promise<IClient[]> => {
        const clients = await clientDal.getAll();
        return(clients);
    },

    getById: async (id: string) => {
        const client = await clientDal.getById(id);
        return(client);
    },

    getClient: async (id: string): Promise<IClient> => {
        const client: IClient = await clientDal.getClient(id);
        return(client);
    },

};

export default clientService;
