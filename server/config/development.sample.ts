import { IEnvConfig } from "@interfaces";
import { LogLevel, LogDetail } from "../constants";

const config: IEnvConfig = {
    port: process.env.PORT || 1420,
    mongo: {
        uri: "mongodb://localhost",
        dbName: "identity-service-dev",
    },
    // authRootUrl: process.env.AUTH_ROOT_URL || "http://identity-service.ro"
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
