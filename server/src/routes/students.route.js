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

router.get("/getTypeForWeek",requireAuth, getStudentWeekType)
router.put('/updateFullWeek',requireAuth, updateFullWeek)

router.get("/",requireAuth, getStudents);
router.get("/:id",requireAuth, getStudent);
router.post("/",requireAuth, createStudent);
router.put("/:id",requireAuth, updateStudent);
router.delete("/:id",requireAuth, deleteStudent);

export default router;
