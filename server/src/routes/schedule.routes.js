import express from "express";
import {
  addProfessor,
  addSchedule,
  addSubject,
  deleteAllSchedulesForStudent,
  deleteSchedule,
  deleteSubject,
  deleteProfessor,
  getAllProfessor,
  getAllSubject,
  getScheduleForStudent,
  getTodayScheduleForStudent,
  updateSchedule,
  updateSubject,
  updateProfessor
} from "../controllers/schedule.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/subjects", requireAuth, getAllSubject);
router.post("/subject", requireAuth, addSubject);
router.put("/subject/:id", requireAuth, updateSubject);
router.delete("/subject/:id", requireAuth, deleteSubject);

router.get("/professors", requireAuth, getAllProfessor);
router.post("/professor", requireAuth, addProfessor);
router.put("/professor/:id", requireAuth, updateProfessor);
router.delete("/professor/:id", requireAuth, deleteProfessor);

router.get("/today", requireAuth, getTodayScheduleForStudent);
router.get("/", requireAuth, getScheduleForStudent);

router.post("/", requireAuth, addSchedule);
router.put("/:id", requireAuth, updateSchedule);
router.delete("/all", requireAuth, deleteAllSchedulesForStudent);
router.delete("/:id", requireAuth, deleteSchedule);

export default router;
