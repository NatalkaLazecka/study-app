import express from "express";
import {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    updateFullWeek,
    getStudentWeekType
} from "../controllers/students.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router = express.Router();

router.get("/",requireAuth, getStudents);
router.get("/:id",requireAuth, getStudent);
router.get("/:id/getTypeForWeek",requireAuth, getStudentWeekType)
router.post("/",requireAuth, createStudent);
router.put("/:id",requireAuth, updateStudent);
router.put('/:id/updateFullWeek',requireAuth, updateFullWeek)
router.delete("/:id",requireAuth, deleteStudent);

export default router;
