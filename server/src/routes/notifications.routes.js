import express from "express";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification   } from "../controllers/notifications.controller.js";

const router = express.Router();

router.get("/", getNotifications);
router.post("/mark-read", markAsRead);
router.post("/mark-all-read", markAllAsRead);
router.delete("/delete", deleteNotification);

export default router;