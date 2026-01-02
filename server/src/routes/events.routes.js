
import express from "express";
import {
  getEvents, getCategories, getEventFiles, getEventsByStudent,
  addEvent, updateEvent, deleteEvent,
  uploadEventFile, downloadEventFile, deleteEventFile, uploadMiddleware
} from "../controllers/events.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/student", requireAuth, getEventsByStudent);
router.get("/", getEvents);
router.get("/categories", getCategories);

router.post("/", requireAuth, addEvent);
router.put("/:id", requireAuth, updateEvent);
router.delete("/:id", requireAuth, deleteEvent);

router.get('/:eventId/files', requireAuth, getEventFiles);
router.post('/:eventId/files', requireAuth, uploadMiddleware, uploadEventFile);
router.get('/files/:fileId/download', requireAuth, downloadEventFile);
router.delete('/files/:fileId', requireAuth, deleteEventFile);

export default router;