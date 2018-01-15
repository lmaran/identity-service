"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_controller_1 = require("./token.controller");
const router = express_1.Router();
router.post("/", token_controller_1.default.getToken);
exports.default = router;
