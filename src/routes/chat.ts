import express from "express";
import { createChat, getChat, getAllChats, editChat, deleteChat } from "../controller";

const router = express.Router()

router.post("", [createChat]);
router.get("", [getChat]);
router.get("/all", [getAllChats]);
router.patch("", editChat);
router.delete("", deleteChat);

export default router;