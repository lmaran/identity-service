"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorize_controller_1 = require("./authorize.controller");
const router = express_1.Router();
router.get("/", authorize_controller_1.default.getAuthorize);
exports.default = router;
