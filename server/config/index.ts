import * as _ from "lodash";
import * as path from "path";
import { EnvironmentType } from "../constants";
import { IEnvConfig } from "@interfaces";

const env: string = (process.env.NODE_ENV || "development").toLowerCase();
const envConfig: IEnvConfig = require(`./${env}`).default;

// All configurations will extend these options
// ============================================

const common: IEnvConfig = {
    env,
    rollbarToken: "c40dd41c292340419923230eed1d0d61",
};

const config = _.merge(common, envConfig);

export default config;
