import { ReturnType } from "../constants";

// interface IBlobSecrets {
//     account?: string;
//     key?: string;
// }

interface IMongoSecrets {
    uri?: string;
    dbName?: string;
    options?: object;
}

export interface IEnvConfig {
    env?: string;
    port?: string | number;
    mongo?: IMongoSecrets;
    rollbarToken?: string;
    // azureBlobStorage?: IBlobSecrets;
    // azureBlobStorageCool?: IBlobSecrets;
    logglyToken?: string;
    logglySubdomain?: string;
    logLevel?: string;
    httpLogDetails?: IHttpLogDetails;
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

export interface IContext {
    accessToken?: any;
    tenantCode?: string;
    requestId?: string;
}

interface IRequestLogDetails {
    general?: string;
    headers?: string;
    body?: boolean | undefined;
}

interface IResponseLogDetails {
    general?: boolean;
    headers?: boolean;
    body?: boolean;
}

export interface IHttpLogDetails {
    request?: IRequestLogDetails;
    response?: IResponseLogDetails;
}
