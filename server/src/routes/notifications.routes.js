import express from "express";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from "../controllers/notifications.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/",requireAuth, getNotifications);
router.post("/mark-read",requireAuth, markAsRead);
router.post("/mark-all-read",requireAuth, markAllAsRead);
router.delete("/delete",requireAuth, deleteNotification);

export default router;