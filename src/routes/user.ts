import express from "express";
import { createUser, getUser, getAllUsers, editUser, deleteUser, registerGithubToken } from "../controller";

const router = express.Router()

router.post("", [createUser]);
router.post("/githubtoken", [registerGithubToken]);
router.get("", [getUser]);
router.get("/all", [getAllUsers]);
router.patch("", editUser);
router.delete("", deleteUser);

export default router;