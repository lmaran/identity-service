import * as _ from "lodash";
import { EnvironmentType, LogDetail, LogLevel } from "../constants";
import { IEnvConfig } from "../interfaces";

const env: string = (process.env.NODE_ENV || EnvironmentType.DEVELOPMENT).toLowerCase();
const envConfig: IEnvConfig = require(`./${env}`).default;

const common: IEnvConfig = {
    env,
    port: process.env.PORT || 1420,
    mongo: {
        uri: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME,
    },
    rollbarToken: process.env.ROLLBAR_TOKEN,
    logglyToken: process.env.LOGGLY_TOKEN,
    logglySubdomain: process.env.LOGGLY_SUBDOMAIN,

    logLevel: process.env.LOG_LEVEL || LogLevel.WARNING,

    httpLogDetails: {
        request: {
            general: process.env.HTTP_LOG_DETAILS_REQUEST_GENERAL || LogDetail.FULL,
            headers: process.env.HTTP_LOG_DETAILS_REQUEST_HEADERS || LogDetail.PARTIAL,
            body: (process.env.HTTP_LOG_DETAILS_REQUEST_BODY as boolean | undefined) || false,
        },
        response: {
            general: (process.env.HTTP_LOG_DETAILS_RESPONSE_GENERAL as boolean | undefined) || false,
            headers: (process.env.HTTP_LOG_DETAILS_RESPONSE_HEADERS as boolean | undefined) || false,
            body: (process.env.HTTP_LOG_DETAILS_RESPONSE_BODY as boolean | undefined) || false,
        },
    },
};

const config = _.merge(common, envConfig);

export default config;
