import express from "express";
import chatRouter from "./chat";
import threadRouter from "./thread";
import userRouter from "./user";

const router = express.Router();

router.use("/user", userRouter);
router.use("/thread", threadRouter);
router.use("/chatRouter", chatRouter);

export default router