import express from "express";
import {
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByStudent,
    getNotificationModes, getTasksByGroup, addGroupTask, addGroupTask, updateGroupTask, toggleGroupTask, deleteGroupTask
} from "../controllers/tasks.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
} from "../validators/task.validator.js";

import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/notification-modes", requireAuth, getNotificationModes);
router.get("/student",requireAuth, getTasksByStudent);
router.get("/",requireAuth, getTasks);
router.post("/", requireAuth, createTaskValidator, validate, addTask);
router.get("/:id", requireAuth, taskIdValidator, validate, getTaskById);
router.put("/:id", requireAuth, updateTaskValidator, validate, updateTask);
router.delete("/:id", requireAuth, taskIdValidator, validate, deleteTask);

router.get("/group/:groupId", requireAuth, getTasksByGroup);
router.post("/group/:groupId", requireAuth, createTaskValidator, validate, addGroupTask);
router.put("/group/:groupId/:id", requireAuth, updateTaskValidator, validate, updateGroupTask);
router.patch("/group/:groupId/:id/toggle", requireAuth, toggleGroupTask);
router.delete("/group/:groupId/:id", requireAuth, taskIdValidator, validate, deleteGroupTask);

export default router;
