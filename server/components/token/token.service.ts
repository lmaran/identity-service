import tokenDal from "./token.dal";
// import { IToken } from "@interfaces";

const tokenService = {

    getAll: async (): Promise<any[]> => {
        const tokens = await tokenDal.getAll();
        return(tokens);
    },

    // getById: async (id: string) => {
    //     const token = await tokenDal.getById(id);
    //     return(token);
    // },

    createToken: async (token: any): Promise<any> => {
        return await tokenDal.createToken(token);
        // return(token);
    },

    getAccessToken: async (token: string): Promise<any> => {
        const tokenInfo: any = await tokenDal.getAccessToken(token);
        return tokenInfo;
    },

    getRefreshToken: async (token: string): Promise<any> => {
        const tokenInfo: any = await tokenDal.getRefreshToken(token);
        return tokenInfo;
    },

    deleteAccessToken: async (token, clientId): Promise<any> => {
        const deletedCount: any = await tokenDal.deleteAccessToken(token, clientId);
        return deletedCount;
    },

    deleteRefreshToken: async (token: string): Promise<any> => {
        const deletedCount: any = await tokenDal.deleteRefreshToken(token);
        return deletedCount;
    },
};

export default tokenService;
