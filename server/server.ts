import config from "./config";
import app from "./app";
import * as http from "http";

// const app = expressApp.getInstance();
const httpServer: http.Server = http.createServer(app);
httpServer.address();

httpServer.listen(config.port);
httpServer.on("error", onError);
httpServer.on("close", onClose);
httpServer.on("listening", onListening);

function onError(error: any) {
    console.log(error.syscall);
    console.log(error.message);
    if (error.syscall !== "listen") {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(`Port ${config.port} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`Port ${config.port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = httpServer.address();
    console.log(`Express server listening on port ${addr.port} in ${config.env} mode;`);
}

function onClose() {
    console.log("was closed");
}

// export default httpServer;