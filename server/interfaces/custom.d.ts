// tslint:disable

// https://stackoverflow.com/a/40762463
// https://github.com/lmaran/green-nations/blob/master/src/typings.d.ts
declare namespace Express {
    export interface Request {
        access_token?: any,
        tenantCode?: string,
    }
 }
