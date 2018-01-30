import * as express from "express";
import * as path from "path";
import allRoutes from "./routes";
import { getTenant, errorLogHandler } from "./middlewares";

import * as url from "url";
import * as bodyParser from "body-parser";
import * as exphbs from "express-handlebars";

const app: express.Application = express();

// https://expressjs.com/en/guide/behind-proxies.html
app.enable("trust proxy");
// app.set("trust proxy", "loopback, 123.123.123.123"); // specify a subnet and an address

app.use(getTenant); // adds req.tokenCode property
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support form-encoded bodies (for the token endpoint)

app.engine(".hbs", exphbs({
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

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views/"));

// app.set("json spaces", 4);

app.use("/", express.static("server/views"));

app.use(allRoutes);
app.use(errorLogHandler);

export default app;
