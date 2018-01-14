import { Router } from "express";

import contactRoutes from "./components/contact/contact.routes";
import homeRoutes from "./components/home/home.routes";
import checkRoutes from "./components/check/check.routes";
import authorizeRoutes from "./components/authorize/authorize.routes";
import approveRoutes from "./components/approve/approve.routes";

const router = Router();

router.use("/contact", contactRoutes);
router.use("/check", checkRoutes);
router.use("/authorize", authorizeRoutes);
router.use("/approve", approveRoutes);
router.use("", homeRoutes);

export default router;
