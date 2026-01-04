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
    getGroupNotes,
    createGroupNote,
    deleteGroupNote,
    getGroupAnnouncements,
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

router.get("/:id/notes", requireAuth, getGroupNotes);
router.post("/:id/notes", requireAuth, createGroupNote);
router.delete("/:id/notes/:noteId", requireAuth, deleteGroupNote);
router.get("/:id/announcements", requireAuth, getGroupAnnouncements);

export default router;
