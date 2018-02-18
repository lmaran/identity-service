"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const config_1 = require("./config");
const app_1 = require("./app");
const logger_1 = require("./logger");
const httpServer = http.createServer(app_1.default);
httpServer.listen(config_1.default.port);
httpServer.on("listening", () => {
    const addr = httpServer.address();
    logger_1.default.warn(`Express server listening on port ${addr.port} in ${config_1.default.env} mode (pid: ${process.pid})`);
});
httpServer.on("error", (error) => {
    if (error.syscall !== "listen") {
        logger_1.default.debug("test123");
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
});
httpServer.on("close", () => {
    logger_1.default.warn("Server was closed");
});
process.on("uncaughtException", (err) => {
    logger_1.default.error(`Caught exception: ${err.message}`, { err });
    gracefulShutdown("uncaughtException");
});
process.on("unhandledRejection", (reason, promise) => {
    logger_1.default.error(`Caught rejection at ${promise}, reason: ${reason}`, { promise, reason });
    gracefulShutdown("unhandledRejection");
});
process.on("warning", (warning) => {
    logger_1.default.warn(`Caught warning: ${warning.message}`, { warning });
});
process.on("SIGTERM", () => {
    gracefulShutdown("SIGTERM");
});
process.on("SIGINT", () => {
    gracefulShutdown("SIGINT");
});
function gracefulShutdown(eventName) {
    const cleanUpAndExit = () => {
        logger_1.default.warn("Cleaned up. Bye!");
        process.exit(0);
    };
    logger_1.default.warn(`${eventName} received. Closing server...`);
    httpServer.close(() => {
        cleanUpAndExit();
    });
    setTimeout(() => {
        logger_1.default.warn("Forcing server to close");
        process.exit(1);
    }, 5000);
}
