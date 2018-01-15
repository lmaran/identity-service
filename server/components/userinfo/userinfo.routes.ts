import { Router } from "express";
import userinfoController from "./userinfo.controller";
import {getAccessToken, requireAccessToken} from "../../util/token";

const router = Router();

router.get("/", getAccessToken, requireAccessToken, userinfoController.getUserinfo);
router.post("/", getAccessToken, requireAccessToken, userinfoController.getUserinfo);

export default router;
