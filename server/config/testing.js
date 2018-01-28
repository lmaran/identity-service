"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    port: process.env.PORT || 1416,
    mongo: {
        uri: "mongodb://localhost",
        dbName: "identity-service-test",
    },
};
exports.default = config;
