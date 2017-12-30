import { Router } from "express";
import contactController from "./contact.controller";

const router = Router();

router.get("/", contactController.getContactPage);

export default router;