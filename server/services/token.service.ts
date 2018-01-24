import { tokenData } from "../data";
// import { IToken } from "@interfaces";

export const tokenService = {

    getAll: async (): Promise<any[]> => {
        const tokens = await tokenData.getAll();
        return(tokens);
    },

    // getById: async (id: string) => {
    //     const token = await tokenDal.getById(id);
    //     return(token);
    // },

    createToken: async (token: any): Promise<any> => {
        return await tokenData.createToken(token);
        // return(token);
    },

    getAccessToken: async (token: string): Promise<any> => {
        const tokenInfo: any = await tokenData.getAccessToken(token);
        return tokenInfo;
    },

    getRefreshToken: async (token: string): Promise<any> => {
        const tokenInfo: any = await tokenData.getRefreshToken(token);
        return tokenInfo;
    },

    deleteAccessToken: async (token, clientId): Promise<any> => {
        const deletedCount: any = await tokenData.deleteAccessToken(token, clientId);
        return deletedCount;
    },

    deleteRefreshToken: async (token: string): Promise<any> => {
        const deletedCount: any = await tokenData.deleteRefreshToken(token);
        return deletedCount;
    },
};
