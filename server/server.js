"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const config_1 = require("./config");
const app_1 = require("./app");
const logger_1 = require("./logger");
const httpServer = http.createServer(app_1.default);
httpServer.address();
httpServer.listen(config_1.default.port);
httpServer.on("error", onError);
httpServer.on("close", onClose);
httpServer.on("listening", onListening);
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    switch (error.code) {
        case "EACCES":
            logger_1.default.error(`Port ${config_1.default.port} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger_1.default.error(`Port ${config_1.default.port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    const addr = httpServer.address();
    logger_1.default.warn(`Express server listening on port ${addr.port} in ${config_1.default.env} mode;`);
}
function onClose() {
    logger_1.default.warn("Express server was closed");
}
