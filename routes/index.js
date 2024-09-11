import express from "express";

import authRouter from "./auth.route.js";
import paintingRouter from './painting.route.js'
import productRouter from './product.route.js'
import messageRouter from './message.route.js'

const router = express.Router();

router.use("/auth", authRouter);
router.use("/painting", paintingRouter);
router.use("/cart", productRouter);
router.use("/message", messageRouter);

export default router