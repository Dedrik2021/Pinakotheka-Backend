import express from "express";

import authRouter from "./auth.route.js";
import paintingRouter from './painting.route.js'

const router = express.Router();

router.use("/auth", authRouter);
router.use("/painting", paintingRouter);

export default router