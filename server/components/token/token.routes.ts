import { Router } from "express";
import tokenController from "./token.controller";

const router = Router();

router.post("/", tokenController.getToken);

export default router;
