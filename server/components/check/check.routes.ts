import { Router } from "express";
import checkController from "./check.controller";

const router = Router();

router.get("/", checkController.getCheckPage);

export default router;