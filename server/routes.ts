import { Router } from "express";
import {getAccessToken, requireAccessToken} from "../server/helpers/token";

import contactController from "./components/contact/contact.controller";
import checkController from "./components/check/check.controller";
import authorizeController from "./components/authorize/authorize.controller";
import approveController from "./components/approve/approve.controller";
import tokenController from "./components/token/token.controller";
import userinfoController from "./components/userinfo/userinfo.controller";
import homepageController from "./components/homepage/homepage.controller";
import homeController from "./components/home/home.controller";

const router = Router();

// contact
router.get("/contact", contactController.getContactPage);

// check
router.get("/check", checkController.getCheckPage);

// authorize
router.get("/authorize", authorizeController.getAuthorize);

// approve
router.post("/approve", approveController.approve);

// token
router.post("/token", tokenController.getToken);

// userinfo
router.get("/userinfo", getAccessToken, requireAccessToken, userinfoController.getUserinfo);
router.post("/userinfo", getAccessToken, requireAccessToken, userinfoController.getUserinfo);

// homepage
router.get("/homepage", homepageController.getHomepage);

// home
router.get("/", homeController.getHomePage);

export default router;
