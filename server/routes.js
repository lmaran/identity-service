"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("./middlewares");
const controllers_1 = require("./controllers");
const router = express_1.Router();
router.get("/contact", controllers_1.contactController.getContactPage);
router.get("/check", controllers_1.checkController.getCheckPage);
router.get("/authorize", controllers_1.authorizeController.getAuthorize);
router.post("/approve", controllers_1.approveController.approve);
router.post("/token", controllers_1.tokenController.getToken);
router.post("/revoke", controllers_1.tokenController.revokeToken);
router.get("/userinfo", middlewares_1.getAccessToken, middlewares_1.requireAccessToken, controllers_1.userinfoController.getUserinfo);
router.post("/userinfo", middlewares_1.getAccessToken, middlewares_1.requireAccessToken, controllers_1.userinfoController.getUserinfo);
router.get("/homepage", controllers_1.homepageController.getHomepage);
router.get("/", controllers_1.homeController.getHomePage);
exports.default = router;