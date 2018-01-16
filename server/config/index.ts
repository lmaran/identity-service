import * as _ from "lodash";
import * as path from "path";
import { EnvironmentType } from "../constants";
import { IEnvConfig } from "../interfaces";

const env: string = (process.env.NODE_ENV || "development").toLowerCase();
const envConfig: IEnvConfig = require(`./${env}`).default;

// All configurations will extend these options
// ============================================

const common: IEnvConfig = {
    env,
    mongo: {
        options: {
            // db: {
            //     // safe: true // in Mongo 2.0 this option is "true" by default and is equals to {w:1}
            //     // details: http://stackoverflow.com/a/14801527
            // }
        },
    },
    rollbarToken: "c40dd41c292340419923230eed1d0d61",
    root: path.normalize(__dirname + "/../../.."), // 3 folders back from the current folder
};

const config = _.merge(common, envConfig);

export default config;
