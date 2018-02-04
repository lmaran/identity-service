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

export interface IErrorOptions {
    developerMessage?: string;
    returnAs?: any;
    redirectUri?: string;
}
