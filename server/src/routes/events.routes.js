import express from "express";
import {
    getEvents, getCategories, getEventFiles,
    addEvent,
    updateEvent,
    deleteEvent,
    uploadEventFile,
    downloadEventFile,
    deleteEventFile, uploadMiddleware
} from "../controllers/events.controller.js";

const router = express.Router();
router.get("/", getEvents);
router.get("/categories", getCategories);
router.post("/", addEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

router.get('/:eventId/files', getEventFiles);
router.post('/:eventId/files', uploadMiddleware, uploadEventFile);
router.get('/files/:fileId/download', downloadEventFile);
router.delete('/files/:fileId', deleteEventFile);

export default router;
