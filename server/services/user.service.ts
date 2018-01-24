import { IUser } from "@interfaces";
import { userData } from "../data";

export const userService = {

    getAll: async (): Promise<IUser[]> => {
        const users = await userData.getAll();
        return(users);
    },

    // getById: async (id: string) => {
    //     const user = await userData.getById(id);
    //     return(user);
    // },

    getUser: async (userName: string): Promise<IUser> => {
        const user: IUser = await userData.getUser(userName);
        return(user);
    },

    getUserByEmail: async (email: string): Promise<IUser> => {
        const user: IUser = await userData.getUserByEmail(email);
        return(user);
    },

};
