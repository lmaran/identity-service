import { Router } from "express";

import contactRoutes from "./components/contact/contact.routes";
import homeRoutes from "./components/home/home.routes";
import checkRoutes from "./components/check/check.routes";
import authorizeRoutes from "./components/authorize/authorize.routes";
import approveRoutes from "./components/approve/approve.routes";
import tokenRoutes from "./components/token/token.routes";
import userinfoRoutes from "./components/userinfo/userinfo.routes";
import homepageRoutes from "./components/homepage/homepage.routes";

const router = Router();

router.use("/contact", contactRoutes);
router.use("/check", checkRoutes);
router.use("/authorize", authorizeRoutes);
router.use("/approve", approveRoutes);
router.use("/token", tokenRoutes);
router.use("/userinfo", userinfoRoutes);
router.use("/homepage", homepageRoutes);
router.use("", homeRoutes);

export default router;
