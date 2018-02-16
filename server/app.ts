import * as express from "express";
import * as path from "path";
import * as favicon from "serve-favicon";
import allRoutes from "./routes";
import { setContext, errorHandler, httpLogHandler, catch404 } from "./middlewares";

import * as url from "url";
import * as bodyParser from "body-parser";
import * as exphbs from "express-handlebars";

const app: express.Application = express();

// https://expressjs.com/en/guide/behind-proxies.html
app.enable("trust proxy"); // allow express to set req.ip
// app.set("trust proxy", "loopback, 123.123.123.123"); // specify a subnet and an address

// view engine setup
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));
app.engine(".hbs", exphbs ({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "/views/layouts/"),
    partialsDir: path.join(__dirname, "/views/partials/"),

    // ensure the javascript is at the bottom of the code in express-handlebars template
    // http://stackoverflow.com/a/25307270, http://stackoverflow.com/a/21740214
    helpers: {
        // tslint:disable-next-line:object-literal-shorthand
        section: function(this: any, name, options) {
            if (!this._sections) { this._sections = {}; }
            this._sections[name] = options.fn(this);
            return null;
        },
    },
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support form-encoded bodies (for the token endpoint)
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", express.static("server/views"));

app.use(setContext); // adds requestId, tokenCode and other properties to the request object
app.use(httpLogHandler);

// app.use(allRoutes);

// catch 404 and forward to error handler
app.use(catch404);
app.use(catch404);
// console.log("222");
// app.use(errorHandler);
// console.log("333");

// "uncaughtException" and "unhandledRejection" are caught in server.ts
app.use(allRoutes);
export default app;
