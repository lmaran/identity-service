import * as http from "http";
import config from "./config";
import app from "./app";
import logger from "./logger";

// const app = expressApp.getInstance();
const httpServer: http.Server = http.createServer(app);
httpServer.address();

httpServer.listen(config.port);
httpServer.on("error", onError);
httpServer.on("close", onClose);
httpServer.on("listening", onListening);

function onError(error: any) {
    if (error.syscall !== "listen") {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error(`Port ${config.port} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger.error(`Port ${config.port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = httpServer.address();
    // logger.error(new Error("This is an error"));
    // logger.log("verbose", "aaabb");
    logger.warn(`Express server listening on port ${addr.port} in ${config.env} mode;`);
}

function onClose() {
    logger.warn("Express server was closed");
}
