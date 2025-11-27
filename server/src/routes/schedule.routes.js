import express from "express";
import {addSchedule, deleteSchedule, getAllProwadzacy, getAllPrzedmioty, getScheduleForStudent, updateSchedule} from "../controllers/schedule.controller.js";

const router = express.Router();
router.get("/student/:student_id", getScheduleForStudent);
router.get("/przedmiot/", getAllPrzedmioty);
router.get("/prowadzacy/", getAllProwadzacy);
router.post("/", addSchedule);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

export default router;
