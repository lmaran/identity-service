"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const app_1 = require("./app");
const http = require("http");
const httpServer = http.createServer(app_1.default);
httpServer.address();
httpServer.listen(config_1.default.port);
httpServer.on("error", onError);
httpServer.on("close", onClose);
httpServer.on("listening", onListening);
function onError(error) {
    console.log(error.syscall);
    console.log(error.message);
    if (error.syscall !== "listen") {
        throw error;
    }
    switch (error.code) {
        case "EACCES":
            console.error(`Port ${config_1.default.port} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`Port ${config_1.default.port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    const addr = httpServer.address();
    console.log(`Express server listening on port ${addr.port} in ${config_1.default.env} mode;`);
}
function onClose() {
    console.log("was closed");
}
