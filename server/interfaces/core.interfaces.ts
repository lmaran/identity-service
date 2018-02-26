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
