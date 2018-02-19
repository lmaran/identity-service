import { IEnvConfig } from "@interfaces";
import { LogLevel, LogDetails } from "../constants";

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
            general: LogDetails.PARTIAL,
            headers: process.env.HTTP_LOG_DETAILS_REQUEST_HEADERS || LogDetails.EMPTY,
        },
    },
};

export default config;
