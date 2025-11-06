import express from "express";
import { getGroups, addGroup, addStudentToGroup, deleteGroup } from "../controllers/groups.controller.js";

const router = express.Router();
router.get("/", getGroups);
router.post("/", addGroup);
router.post("/join", addStudentToGroup);
router.delete("/:id", deleteGroup);
export default router;
