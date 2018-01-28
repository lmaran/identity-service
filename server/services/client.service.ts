import { clientData } from "../data";
import { IClient } from "@interfaces";

export const clientService = {

    getByCode: async (clientCode: string, tenantCode: string): Promise<IClient> => {
        const client: IClient = await clientData.getByCode(clientCode, tenantCode);
        return(client);
    },

};
