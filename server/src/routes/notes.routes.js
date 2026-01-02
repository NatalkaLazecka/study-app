import express from "express";
import {getNotes, addNote, updateNote, deleteNote} from "../controllers/notes.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/",requireAuth, getNotes);
router.post("/",requireAuth, addNote);
router.put("/:id",requireAuth, updateNote);
router.delete("/:id",requireAuth, deleteNote);

export default router;
