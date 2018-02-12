"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const env = (process.env.NODE_ENV || "development").toLowerCase();
const envConfig = require(`./${env}`).default;
const common = {
    env,
};
const config = _.merge(common, envConfig);
exports.default = config;
