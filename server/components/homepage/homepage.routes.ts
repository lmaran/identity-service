import { Router } from "express";
import homepageController from "./homepage.controller";

const router = Router();

router.get("/", homepageController.getHomepage);

export default router;
