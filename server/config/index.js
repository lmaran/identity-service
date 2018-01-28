"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const env = (process.env.NODE_ENV || "development").toLowerCase();
const envConfig = require(`./${env}`).default;
const common = {
    env,
    rollbarToken: "c40dd41c292340419923230eed1d0d61",
};
const config = _.merge(common, envConfig);
exports.default = config;
