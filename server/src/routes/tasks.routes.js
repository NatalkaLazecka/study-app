import express from "express";
import { getTasks, addTask, updateTask, deleteTask, getTaskById } from "../controllers/tasks.controller.js";

const router = express.Router();
router.get("/", getTasks);
router.post("/", addTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/tasks/:id", getTaskById);

export default router;
