"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rollbar = require("rollbar");
const config_1 = require("../config");
const rollbar = new Rollbar({
    accessToken: config_1.default.rollbarToken,
    environment: config_1.default.env,
});
exports.errorLogHandler = rollbar.errorHandler();
