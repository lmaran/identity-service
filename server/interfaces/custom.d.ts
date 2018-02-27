import { IContext } from "../interfaces";

// method 1: used when we only use properties with primitive types
// https://stackoverflow.com/a/40762463
// https://github.com/lmaran/green-nations/blob/master/src/typings.d.ts
// declare namespace Express {

//     export interface Request {
//         access_token?: any,
//         tenantCode?: string,
//     }
//  }

// method 2: used when we need to use properties with "complex" types (that have to be imported)
// http://stackoverflow.com.mevn.net/questions/40094255/extend-express-request-object-with-sequelize-model-using-typescript-2
// https://stackoverflow.com/a/47448486
declare global {
    namespace Express {
        interface Request {
            ctx: IContext
        }
    }
}

// https://stackoverflow.com/a/43797190
declare module "winston" {
    export interface Transports {
        Rollbar?: any,
    }
 }