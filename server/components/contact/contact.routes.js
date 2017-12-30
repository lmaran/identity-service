"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("./contact.controller");
const router = express_1.Router();
router.get("/", contact_controller_1.default.getContactPage);
exports.default = router;
