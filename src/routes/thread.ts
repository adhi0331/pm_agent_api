import express from "express";
import { createThread, getThread, getAllThreads, editThread, deleteThread } from "../controller";

const router = express.Router()

router.post("", [createThread]);
router.get("", [getThread]);
router.get("/all", [getAllThreads]);
router.patch("", editThread);
router.delete("", deleteThread);

export default router;