"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    port: process.env.PORT || 1420,
    mongo: {
        uri: "mongodb://localhost/identity-service-dev",
    },
};
exports.default = config;
