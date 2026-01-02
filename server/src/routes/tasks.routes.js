import express from "express";
import {
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByStudent
} from "../controllers/tasks.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/notification-modes", requireAuth, getNotificationModes);
router.get("/student",requireAuth, getTasksByStudent);
router.get("/",requireAuth, getTasks);
router.post("/",requireAuth, addTask);
router.get("/:id",requireAuth, getTaskById);
router.put("/:id",requireAuth, updateTask);
router.delete("/:id",requireAuth, deleteTask);

export default router;
