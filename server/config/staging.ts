import { IEnvConfig } from "@interfaces";

const config: IEnvConfig = {
    port: process.env.PORT,
    mongo: {
        uri: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME,
    },
    azureBlobStorage: {
        account: process.env.AZURE_BLOB_STORAGE_ACCOUNT,
        key: process.env.AZURE_BLOB_STORAGE_ACCESS_KEY,
    },
    azureBlobStorageCool: {
        account: process.env.AZURE_BLOB_STORAGE_COOL_ACCOUNT,
        key: process.env.AZURE_BLOB_STORAGE_COOL_ACCESS_KEY,
    },
    authRootUrl: process.env.AUTH_ROOT_URL,
    rollbarToken: process.env.ROLLBAR_TOKEN,
};

export default config;
