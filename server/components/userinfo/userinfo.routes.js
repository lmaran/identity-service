"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userinfo_controller_1 = require("./userinfo.controller");
const token_1 = require("../../util/token");
const router = express_1.Router();
router.get("/", token_1.getAccessToken, token_1.requireAccessToken, userinfo_controller_1.default.getUserinfo);
router.post("/", token_1.getAccessToken, token_1.requireAccessToken, userinfo_controller_1.default.getUserinfo);
exports.default = router;
