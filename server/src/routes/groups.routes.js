import express from "express";
import {
  getGroups,
  createGroup,
  getGroupDetails,
  addUserToGroup,
  deleteGroup,
} from "../controllers/groups.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, getGroups);
router.post("/", requireAuth, createGroup);

router.get("/:id", requireAuth, getGroupDetails);
router.post("/:id/add-user", requireAuth, addUserToGroup);
router.delete("/:id", requireAuth, deleteGroup);

export default router;
