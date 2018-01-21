import userDal from "./user.dal";
import { IUser } from "@interfaces";

const userService = {

    getAll: async (): Promise<IUser[]> => {
        const users = await userDal.getAll();
        return(users);
    },

    // getById: async (id: string) => {
    //     const user = await userDal.getById(id);
    //     return(user);
    // },

    getUser: async (userName: string): Promise<IUser> => {
        const user: IUser = await userDal.getUser(userName);
        return(user);
    },

    getUserByEmail: async (email: string): Promise<IUser> => {
        const user: IUser = await userDal.getUserByEmail(email);
        return(user);
    },

};

export default userService;
