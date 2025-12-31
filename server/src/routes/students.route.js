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

const router = express.Router();

router.get("/", getStudents);
router.get("/:id", getStudent);
router.get("/:id/getTypeForWeek", getStudentWeekType)
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.put('/:id/updateFullWeek', updateFullWeek)
router.delete("/:id", deleteStudent);

export default router;
