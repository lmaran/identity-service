import { clientData } from "../data";
import { IClient } from "@interfaces";

export const clientService = {

    getAll: async (): Promise<IClient[]> => {
        const clients = await clientData.getAll();
        return(clients);
    },

    // getById: async (id: string) => {
    //     const client = await clientDal.getById(id);
    //     return(client);
    // },

    getClient: async (id: string): Promise<IClient> => {
        const client: IClient = await clientData.getClient(id);
        return(client);
    },

};
