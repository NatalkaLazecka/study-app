import express from "express";
import {
    addProfessor, addSchedule, addSubject,
    deleteAllSchedulesForStudent, deleteSchedule, deleteSubject, deleteProfessor,
    getAllProfessor, getAllSubject, getScheduleForStudent, getTodayScheduleForStudent,
    updateSchedule, updateSubject, updateProfessor, updateFullWeek
} from "../controllers/schedule.controller.js";

const router = express.Router();

router.get("/subjects/", getAllSubject);
router.post('/subject', addSubject);
router.put('/subject/:id', updateSubject);
router.delete('/subject/:id', deleteSubject);

router.get("/professors/", getAllProfessor);
router.post('/professor', addProfessor);
router.put('/professor/:id', updateProfessor);
router.delete('/professor/:id', deleteProfessor);

router.get("/student/:student_id/today", getTodayScheduleForStudent);
router.get("/student/:student_id", getScheduleForStudent);
router.post("/", addSchedule);
router.put("/:id", updateSchedule);
router.delete("/student/:student_id/all", deleteAllSchedulesForStudent);
router.delete("/:id", deleteSchedule);

export default router;
