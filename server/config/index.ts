import * as _ from "lodash";
import * as path from "path";
import { EnvironmentType, HttpRequestLogDetails, HttpResponseLogDetails } from "../constants";
import { IEnvConfig } from "@interfaces";

const env: string = (process.env.NODE_ENV || "development").toLowerCase();
const envConfig: IEnvConfig = require(`./${env}`).default;

// All configurations will extend these options
// ============================================

const common: IEnvConfig = {
    env,
    logLevel: process.env.LOG_LEVEL || "warning",
    httpRequestLogDetails: process.env.HTTP_REQUEST_LOG_DETAILS || HttpRequestLogDetails.MIN_HEADER,
    httpResponseLogDetails: process.env.HTTP_RESPONSE_LOG_DETAILS || HttpResponseLogDetails.NO_RESPONSE,
};

const config = _.merge(common, envConfig);

export default config;
