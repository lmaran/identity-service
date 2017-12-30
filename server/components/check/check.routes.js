"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const check_controller_1 = require("./check.controller");
const router = express_1.Router();
router.get("/", check_controller_1.default.getCheckPage);
exports.default = router;
