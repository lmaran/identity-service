import { IConfig } from "./";

const config: IConfig = {
    port: process.env.PORT,
    mongo: {
        uri: process.env.MONGO_URI
    },
    azureBlobStorage: {
        account: process.env.AZURE_BLOB_STORAGE_ACCOUNT,
        key: process.env.AZURE_BLOB_STORAGE_ACCESS_KEY
    },
    azureBlobStorageCool: {
        account: process.env.AZURE_BLOB_STORAGE_COOL_ACCOUNT,
        key: process.env.AZURE_BLOB_STORAGE_COOL_ACCESS_KEY
    },
    authRootUrl: process.env.AUTH_ROOT_URL
};

export default config;