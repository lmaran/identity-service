"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const routes_1 = require("./routes");
const middlewares_1 = require("./middlewares");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const app = express();
app.enable("trust proxy");
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));
app.engine(".hbs", exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "/views/layouts/"),
    partialsDir: path.join(__dirname, "/views/partials/"),
    helpers: {
        section: function (name, options) {
            if (!this._sections) {
                this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
        },
    },
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.static(path.join(__dirname, "public")));
app.use(middlewares_1.setContext);
app.use(middlewares_1.httpLogHandler);
app.use(routes_1.default);
app.use(middlewares_1.catch404);
app.use(middlewares_1.errorHandler);
exports.default = app;
