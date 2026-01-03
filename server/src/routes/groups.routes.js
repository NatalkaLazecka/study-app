import express from "express";
import {
    getGroups,
    createGroup,
    getGroupDetails,
    addUserToGroup,
    deleteGroup,
    removeUserFromGroup,
    leaveGroup,
    transferAdmin,
} from "../controllers/groups.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, getGroups);
router.post("/", requireAuth, createGroup);

router.get("/:id", requireAuth, getGroupDetails);
router.post("/:id/add-user", requireAuth, addUserToGroup);
router.delete("/:id/members/:memcerId", requireAuth, removeUserFromGroup);
router.post("/:id/leave", requireAuth, leaveGroup);
router.put("/:id/transfer-admin", requireAuth, transferAdmin)
router.delete("/:id", requireAuth, deleteGroup);

export default router;
