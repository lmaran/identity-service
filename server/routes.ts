import { Router } from "express";

import contactRoutes from "./components/contact/contact.routes";
import homeRoutes from "./components/home/home.routes";
import checkRoutes from "./components/check/check.routes";

const router = Router();

router.use("/contact", contactRoutes);
router.use("/check", checkRoutes);
router.use("", homeRoutes);

export default router;