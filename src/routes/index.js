import {Router} from "express";
import apiRouter from "./api.js";
import webRouter from "./web.js";

const router = Router();

router.use("/", webRouter);
router.use("/api", apiRouter);

export default router;
