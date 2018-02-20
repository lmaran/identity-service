import { Router } from "express";
import { getAccessToken, requireAccessToken } from "./middlewares";

import { contactController, checkController, authorizeController, approveController, tokenController,
    userinfoController, homepageController, homeController } from "./controllers";

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
router.post("/revoke", tokenController.revokeToken);

// userinfo
router.get("/userinfo", getAccessToken, requireAccessToken, userinfoController.getUserinfo);
router.post("/userinfo", getAccessToken, requireAccessToken, userinfoController.getUserinfo);

// homepage
router.get("/homepage", homepageController.getHomepage);
router.post("/homepage", homepageController.getHomepage);

// home
router.get("/", homeController.getHomePage);

export default router;
