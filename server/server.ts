import * as http from "http";
import config from "./config";
import app from "./app";
import logger from "./logger";

const httpServer: http.Server = http.createServer(app);
httpServer.listen(config.port);

httpServer.on("listening", () => {
    const addr = httpServer.address();
    logger.warn(`Express server listening on port ${addr.port} in ${config.env} mode;`);
});

httpServer.on("error", (error: any) => {
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
});
httpServer.on("close", () => {
    logger.warn("Express server was closed");
});

// https://nodejs.org/api/process.html#process_event_uncaughtexception
// https://strongloop.com/strongblog/robust-node-applications-error-handling/

// test:
// Intentionally cause an exception, but don't catch it.
// nonexistentFunc();
process.on("uncaughtException", (err: Error) => {
    logger.error(`Caught exception: ${err}\n`);
    // https://stackoverflow.com/a/40867663
    // The correct use of 'uncaughtException' is to perform synchronous cleanup of allocated
    // resources (e.g. file descriptors, handles, etc) before shutting down the process.
    process.exit(1);
});

// https://nodejs.org/api/process.html#process_event_unhandledrejection
// http://thecodebarbarian.com/unhandled-promise-rejections-in-node.js.html
// https://www.bennadel.com/blog/3238-logging-and-debugging-unhandled-promise-rejections-in-node-js-v1-4-1-and-later.htm

// test1:
// somePromise.then((res) => {
//     return reportToUser(JSON.pasre(res)); // note the typo (`pasre`)
//   }); // no `.catch` or `.then`
// test2:
// Promise.reject(new Error('woops')); // never attach a `catch`
process.on("unhandledRejection", (reason: Error | any, promise: Promise<any>) => {
    // reason - the object with which the promise was rejected (typically an Error object)
    // promise - the Promise that was rejected
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    // process.exit(1); // I think we don't have to exit in this case
});

// https://nodejs.org/api/process.html#process_event_warning
// warning argument is an Error object (with name, message and stack)

// test:
// $ node
// > events.defaultMaxListeners = 1;
// > process.on("foo", () => {});
// > process.on("foo", () => {});

process.on("warning", (warning: Error) => {
    logger.warn(warning.message, warning);
  });
