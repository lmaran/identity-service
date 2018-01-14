import { Router } from "express";
import approveController from "./approve.controller";

const router = Router();

router.post("/", approveController.approve);

export default router;
