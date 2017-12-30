import * as _ from "lodash";
import * as path from "path";

const env: string = (process.env.NODE_ENV || "development").toLowerCase();
const envConfig: IConfig = require(`./${env}`).default;

interface IBlobSecrets {
    account: string;
    key: string;
}

interface IMongoSecrets {
    uri?: string;
    options?: object;
}

const enum EnvironmentType {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production",
    TEST = "testing"
}

interface IConfig {
    env?: string;
    root?: string;
    port?: string | number;
    userRoles?: string[];
    mongo?: IMongoSecrets;
    rollbarToken?: string;
    // externalUrl?: string;
    azureBlobStorage?: IBlobSecrets;
    azureBlobStorageCool?: IBlobSecrets;
    authRootUrl?: string;
}

// All configurations will extend these options
// ============================================

const common: IConfig = {
    env: env,
    mongo: {
        options: {
            // db: {
            //     // safe: true // in Mongo 2.0 this option is "true" by default and is equals to {w:1}
            //     // details: http://stackoverflow.com/a/14801527
            // }
        }
    },
    rollbarToken: "c40dd41c292340419923230eed1d0d61",
    root: path.normalize(__dirname + "/../../..") // 3 folders back from the current folder
};

const config = _.merge(common, envConfig);

export { IConfig, EnvironmentType };
export default config;