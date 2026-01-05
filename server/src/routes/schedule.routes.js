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
import {
  createScheduleValidator,
  updateScheduleValidator,
  createProfessorValidator,
  updateProfessorValidator,
  createSubjectValidator,
  updateSubjectValidator,
  idParamValidator,
} from "../validators/schedule.validator.js";

import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/subjects", requireAuth, getAllSubject);
router.post("/subject", requireAuth, createSubjectValidator, validate, addSubject);
router.put("/subject/:id", requireAuth, updateSubjectValidator, validate, updateSubject);
router.delete("/subject/:id", requireAuth, idParamValidator, validate, deleteSubject);

router.get("/professors", requireAuth, getAllProfessor);
router.post("/professor", requireAuth, createProfessorValidator, validate, addProfessor);
router.put("/professor/:id", requireAuth, updateProfessorValidator, validate, updateProfessor);

router.delete("/professor/:id", requireAuth, idParamValidator, validate, deleteProfessor);

router.get("/today", requireAuth, getTodayScheduleForStudent);
router.get("/", requireAuth, getScheduleForStudent);
router.post("/", requireAuth, createScheduleValidator, validate, addSchedule);
router.put("/:id", requireAuth, updateScheduleValidator, validate, updateSchedule);
router.delete("/all", requireAuth, deleteAllSchedulesForStudent);
router.delete("/:id", requireAuth, idParamValidator, validate, deleteSchedule);

export default router;
