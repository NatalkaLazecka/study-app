import express from "express";
import {addSchedule, deleteSchedule, getAllProwadzacy, getAllPrzedmioty, getScheduleForStudent, updateSchedule, deleteAllSchedulesForStudent} from "../controllers/schedule.controller.js";

const router = express.Router();
router.get("/student/:student_id", getScheduleForStudent);
router.get("/przedmiot/", getAllPrzedmioty);
router.get("/prowadzacy/", getAllProwadzacy);
router.post("/", addSchedule);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);
router.delete("/student/:student_id/all", deleteAllSchedulesForStudent);

export default router;
