import * as winston from "winston";
import * as chalk from "chalk";
import { LogSource } from "../constants";

export const formatterFunc = options => {
    // The return string will be passed to logger.
    const meta = options.meta;
    const message = options.message;
    let msg = "";

    if (meta.logSource === LogSource.HTTP_LOG_HANDLER) {
        if (meta.req) {
            msg = msg + meta.req.method + " " + meta.req.url;
            if (meta.res) {
                msg = msg + " " + getColorStatus(meta.res.statusCode) + " - " + meta.res.responseTime + " ms ";
            }
        }

        // // only for LOG_LEVEL=DEBUG (get full req/res)
        // if (meta && Object.keys(meta).length > 0) {
        //     const stack = meta.stack;
        //     if (stack) { delete meta.stack; }
        //     msg = msg + "\n" + JSON.stringify(meta, null, 4);

        //     if (stack) {
        //         msg = msg + "\n" + stack;
        //     }
        // }

    } else if (meta.logSource === LogSource.ERROR_HANDLER) {
        msg = msg + (undefined !== message ? message : "");
        if (meta && Object.keys(meta).length > 0) {
            const stack = meta.stack;
            if (stack) { delete meta.stack; }
            msg = msg + "\n" + JSON.stringify(meta, null, 4);

            if (stack) {
                msg = msg + "\n" + stack;
            }
        }
    } else { // logSource === LogSource.CODE
        msg = msg + (undefined !== message ? message : "");
        if (meta && Object.keys(meta).length > 0) {
            const stack = meta.stack;
            if (stack) { delete meta.stack; }
            msg = msg + "\n" + JSON.stringify(meta, null, 4);

            if (stack) {
                msg = msg + "\n" + stack;
            }
        }
    }

    return winston.config.colorize(options.level) + " " + msg;
};

function getColorStatus(status) {
    let statusColor = "green";
    if (status >= 500) { statusColor = "red"; } else if (status >= 400) { statusColor = "yellow"; } else if (status >= 300) { statusColor = "cyan"; }

    return chalk[statusColor](status);
}
