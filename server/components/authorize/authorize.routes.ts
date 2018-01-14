import { Router } from "express";
import authorizeController from "./authorize.controller";

const router = Router();

router.get("/", authorizeController.getAuthorize);

export default router;
