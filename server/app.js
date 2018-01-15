"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const routes_1 = require("./routes");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine(".hbs", exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "/views/layouts/"),
    partialsDir: path.join(__dirname, "/views/partials/"),
    helpers: {
        section: (name, options) => {
            if (!this._sections) {
                this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
        },
    },
}));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views/"));
app.use("/", express.static("server/views"));
app.use(routes_1.default);
exports.default = app;
