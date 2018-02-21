import { IEnvConfig } from "@interfaces";
import { LogLevel, LogDetail } from "../constants";

const config: IEnvConfig = {
    mongo: {
        uri: "mongodb://localhost",
        dbName: "identity-service-dev",
    },
    rollbarToken: "<rollbarToken>",
    logglyToken: "<logglyToken>",
    logglySubdomain: "<logglySubdomain>",
    logLevel: LogLevel.DEBUG,
    httpLogDetails: {
        request: {
            general: LogDetail.PARTIAL,
            headers: LogDetail.NONE,
            body: false,
        },
        response: {
            general: false,
            headers: false,
            body: false,
        },
    },
};

export default config;
