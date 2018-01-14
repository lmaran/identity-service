"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const approve_controller_1 = require("./approve.controller");
const router = express_1.Router();
router.post("/", approve_controller_1.default.approve);
exports.default = router;
