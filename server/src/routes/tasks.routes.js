import express from "express";
import {
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByStudent
} from "../controllers/tasks.controller.js";

const router = express.Router();

router.get("/student/:studentId", getTasksByStudent);
router.get("/", getTasks);
router.post("/", addTask);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
