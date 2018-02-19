import * as _ from "lodash";
import * as path from "path";
import { EnvironmentType, LogDetail } from "../constants";
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
            general: process.env.HTTP_LOG_DETAILS_REQUEST_GENERAL || LogDetail.FULL,
            headers: process.env.HTTP_LOG_DETAILS_REQUEST_HEADERS || LogDetail.PARTIAL,
            body: process.env.HTTP_LOG_DETAILS_REQUEST_BODY || LogDetail.EMPTY,
        },
        response: {
            general: process.env.HTTP_LOG_DETAILS_RESPONSE_GENERAL || LogDetail.EMPTY,
            headers: process.env.HTTP_LOG_DETAILS_RESPONSE_HEADERS || LogDetail.EMPTY,
            body: process.env.HTTP_LOG_DETAILS_RESPONSE_BODY || LogDetail.EMPTY,
        },
    },
};

const config = _.merge(common, envConfig);

export default config;
