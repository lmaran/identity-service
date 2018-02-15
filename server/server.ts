import * as http from "http";
import config from "./config";
import app from "./app";
import logger from "./logger";

const httpServer: http.Server = http.createServer(app);
httpServer.listen(config.port);

httpServer.on("listening", () => {
    const addr = httpServer.address();
    logger.warn(`Express server listening on port ${addr.port} in ${config.env} mode (pid: ${process.pid})`);

    // Graceful start (with PM2)
    // http://pm2.keymetrics.io/docs/usage/signals-clean-restart/#graceful-start

    // Sometimes you might need to wait for your application to have established
    // connections with your DBs/caches/workers/whatever.
    // PM2 needs to wait before considering your application as online. To do this:
    // 1. start the app with this flag:
    //          pm2 start app.js --wait-ready
    // 2. from app, send the 'ready' signal to PM2
    //          process.send("ready");

    // Here we send the ready signal to PM2
    // (process as any).send("ready"); // hack to skip a ts error - https://github.com/Microsoft/TypeScript/issues/10158
});

httpServer.on("error", (error: any) => {
    if (error.syscall !== "listen") {
        logger.debug("test123");
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error(`Port ${config.port} requires elevated privileges`);
            process.exit(1); // exit with failure code
            break;
        case "EADDRINUSE":
            logger.error(`Port ${config.port} is already in use`);
            process.exit(1); // exit with failure code
            break;
        default:
            throw error;
    }
});
httpServer.on("close", () => {
    logger.warn("Server was closed");
});

// https://nodejs.org/api/process.html#process_event_uncaughtexception
// https://strongloop.com/strongblog/robust-node-applications-error-handling/

// test:
// Intentionally cause an exception, but don't catch it.
// nonexistentFunc();
process.on("uncaughtException", (err: Error) => {
    logger.error(`Caught exception: ${err.message}`, {err});
    // https://stackoverflow.com/a/40867663
    // The correct use of 'uncaughtException' is to perform synchronous cleanup of allocated
    // resources (e.g. file descriptors, handles, etc) before shutting down the process.

    gracefulShutdown("uncaughtException");
    // process.exit(1); // exit with failure c=ode
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
    logger.error(`Caught rejection at ${promise}, reason: ${reason}`, { promise, reason} );
    // application specific logging, throwing an error, or other logic here

    // throw the error in order to force nodejs to crash
    // https://medium.com/@dtinth/making-unhandled-promise-rejections-crash-the-node-js-process-ffc27cfcc9dd
    // throw reason;

    gracefulShutdown("unhandledRejection");
});

// https://nodejs.org/api/process.html#process_event_warning
// warning argument is an Error object (with name, message and stack)

// test:
// $ node
// > events.defaultMaxListeners = 1;
// > process.on("foo", () => {});
// > process.on("foo", () => {});

process.on("warning", (warning: Error) => {
    logger.warn(`Caught warning: ${warning.message}`, { warning });
});

// https://joseoncode.com/2014/07/21/graceful-shutdown-in-node-dot-js/
// A signal is an asynchronous notification sent to a process (or to a specific thread within
// the same process) in order to notify it of an event that occurred.

// SIGTERM is a way to politely ask a program to terminate.
// The program can either handle this signal, clean up resources and then exit, or it can ignore the signal.
// The program doesn't exit until it finished processing and serving the last request.
// After the SIGTERM signal it doesn't handle more requests.
// Every process manager will send a SIGKILL if the SIGTERM takes too much time.

// SIGKILL is used to cause immediate termination. Unlike SIGTERM it can't be handled or ignored by the process.
process.on("SIGTERM", () => {
    gracefulShutdown("SIGTERM");
});

// Graceful shutdown NodeJS HTTP server when using PM2
// http://www.acuriousanimal.com/2017/08/27/graceful-shutdown-node-processes.html
// SIGINT - the signal sent by PM to ask a process to shut down
// this signal is also sent when you Ctrl+C in terminal
process.on("SIGINT", () => {
    gracefulShutdown("SIGINT");
    // Now pm2 reload will become a gracefulReload.
});

function gracefulShutdown(eventName) {
    const cleanUpAndExit = () => {
        // close db, then exit
        // db.stop(err => {
        //     process.exit(err ? 1 : 0);
        // });
        logger.warn("Cleaned up. Bye!");
        process.exit(0); // exit with success code
    };

    logger.warn(`${eventName} received. Closing server...`);

    // the http server has a close method that stops the server for receiving new connections
    // and calls the callback once it finished handling all requests
    httpServer.close(() => {
        // logger.warn("Server closed."); we already have such event (httpServer.on("close", ...))
        cleanUpAndExit();
    });

    // Force close server after 5 secs
    setTimeout( () => {
        logger.warn("Forcing server to close");
        process.exit(1); // exit with failure code
    }, 5000);
}
