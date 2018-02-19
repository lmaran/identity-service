import * as _ from "lodash";
import * as path from "path";
import { EnvironmentType, LogDetails } from "../constants";
import { IEnvConfig } from "@interfaces";

const env: string = (process.env.NODE_ENV || "development").toLowerCase();
const envConfig: IEnvConfig = require(`./${env}`).default;

// All configurations will extend these options
// ============================================

const common: IEnvConfig = {
    env,
    logLevel: process.env.LOG_LEVEL || "warning",
    // httpRequestLogDetails: process.env.HTTP_REQUEST_LOG_DETAILS || HttpRequestLogDetails.MIN_HEADER,
    // httpResponseLogDetails: process.env.HTTP_RESPONSE_LOG_DETAILS || HttpResponseLogDetails.NO_RESPONSE,

    httpLogDetails: {
        request: {
            general: process.env.HTTP_LOG_DETAILS_REQUEST_GENERAL || LogDetails.FULL,
            headers: process.env.HTTP_LOG_DETAILS_REQUEST_HEADERS || LogDetails.PARTIAL,
            body: process.env.HTTP_LOG_DETAILS_REQUEST_BODY || LogDetails.EMPTY,
        },
        response: {
            general: process.env.HTTP_LOG_DETAILS_RESPONSE_GENERAL || LogDetails.EMPTY,
            headers: process.env.HTTP_LOG_DETAILS_RESPONSE_HEADERS || LogDetails.EMPTY,
            body: process.env.HTTP_LOG_DETAILS_RESPONSE_BODY || LogDetails.EMPTY,
        },
    },
};

const config = _.merge(common, envConfig);

export default config;
