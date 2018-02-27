import { Router } from "express";
import { getAccessToken, requireAccessToken } from "./middlewares";

import { contactController, checkController, authorizeController, approveController, tokenController,
    userinfoController, homepageController, homeController } from "./controllers";

const router = Router();

// check
router.get("/check", checkController.getCheckPage);

// home
router.get("/", homeController.getHomePage);

// contact
router.get("/contact", contactController.getContactPage);

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

export default router;
