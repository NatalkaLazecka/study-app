import express from "express";
import { getEvents, addEvent, updateEvent, deleteEvent, getCategories } from "../controllers/events.controller.js";

const router = express.Router();
router.get("/", getEvents);
router.get("/categories", getCategories);
router.post("/", addEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
