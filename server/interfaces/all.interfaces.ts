import { ReturnType } from "../constants";

interface IBlobSecrets {
    account?: string;
    key?: string;
}

interface IMongoSecrets {
    uri?: string;
    dbName?: string;
    options?: object;
}

export interface IEnvConfig {
    env?: string;
    root?: string;
    port?: string | number;
    userRoles?: string[];
    mongo?: IMongoSecrets;
    rollbarToken?: string;
    azureBlobStorage?: IBlobSecrets;
    azureBlobStorageCool?: IBlobSecrets;
    authRootUrl?: string;
    logglyToken?: string;
    logglySubdomain?: string;
    logLevel?: string;
    httpRequestLogDetails?: string | number;
    httpResponseLogDetails?: string | number;

    httpLogDetails: IHttpLogDetails;
}

export interface IClient {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
    scope: string;
    tenantCode: string;
}

export interface IUser {
    sub: string;
    preferred_username: string;
    name: string;
    email: string;
    email_verified: boolean;
    username: string;
    hashedPassword: string;
    salt: string;
}

// export interface IUsersObj {
//     [key: string]: IUser;
// }

export interface IOptionsUri {
    error?: string;
    code?: string;
    state?: string;
}

export interface IPersistedPassword {
    salt: string;
    hashedPassword: string;
}

// export interface IErrorOptions {
//     status: number;
//     developerMessage?: string;
//     returnAs?: ReturnType;
//     redirectUri?: URL;
// }

export interface IContext {
    accessToken?: any;
    tenantCode?: string;
    requestId?: string;
    startTime?: Date;
}

interface ILogDetails {
    general?: string;
    headers?: string;
    body?: string;
}

export interface IHttpLogDetails {
    request?: ILogDetails;
    response?: ILogDetails;
}
