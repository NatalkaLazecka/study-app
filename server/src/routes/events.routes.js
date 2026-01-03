
import express from "express";
import {
  getEvents, getCategories, getEventFiles, getEventsByStudent,
  addEvent, updateEvent, deleteEvent,
  uploadEventFile, downloadEventFile, deleteEventFile, uploadMiddleware, getNotificationModes,  getEventById
} from "../controllers/events.controller.js";
import {
  createEventValidator,
  updateEventValidator,
  eventIdParamValidator,
  fileIdParamValidator,
} from "../validators/event.validator.js";

import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/notification-modes", requireAuth, getNotificationModes);
router.get("/student", requireAuth, getEventsByStudent);
router.get("/", getEvents);
router.get("/categories", getCategories);

router.post(
  "/",
  requireAuth,
  createEventValidator,
  validate,
  addEvent
);

router.get(
  "/:id",
  requireAuth,
  eventIdParamValidator,
  // validate,
  getEventById
);

router.put(
  "/:id",
  requireAuth,
  updateEventValidator,
  validate,
  updateEvent
);

router.delete(
  "/:id",
  requireAuth,
  eventIdParamValidator,
  validate,
  deleteEvent
);

router.get(
  "/:eventId/files",
  requireAuth,
  eventIdParamValidator,
  validate,
  getEventFiles
);

router.post(
  "/:eventId/files",
  requireAuth,
  eventIdParamValidator,
  validate,
  uploadMiddleware,
  uploadEventFile
);

router.get(
  "/files/:fileId/download",
  requireAuth,
  fileIdParamValidator,
  validate,
  downloadEventFile
);

router.delete(
  "/files/:fileId",
  requireAuth,
  fileIdParamValidator,
  validate,
  deleteEventFile
);

export default router;