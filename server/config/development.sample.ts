import { IEnvConfig } from "@interfaces";
import { LogLevel, HttpRequestLogDetails, HttpResponseLogDetails } from "../constants";

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
    httpRequestLogDetails: HttpRequestLogDetails.URL_ONLY,
    httpResponseLogDetails: HttpResponseLogDetails.NO_RESPONSE,
};

export default config;
