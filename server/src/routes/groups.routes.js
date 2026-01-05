import express from "express";
import {
    getGroups,
    createGroup,
    getGroupDetails,
    addUserToGroup,
    deleteGroup,
    removeUserFromGroup,
    leaveGroup,
    getGroupNotes,
    createGroupNote,
    deleteGroupNote,
    getGroupAnnouncements,
    getGroupCategories,
} from "../controllers/groups.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {validate} from "../middleware/validate.js";
import {
    createGroupValidator,
    groupIdValidator,
    addMemberValidator,
    removeMemberValidator,
    createNoteValidator,
    deleteNoteValidator,
    getAnnouncementsValidator,
} from "../validators/group.validator.js";

const router = express.Router();

router.get("/categories", getGroupCategories);

router.get("/", requireAuth, getGroups);
router.post("/", requireAuth, createGroupValidator, validate, createGroup);

router.get("/:id", requireAuth, groupIdValidator, validate, getGroupDetails);
router.delete("/:id", requireAuth, groupIdValidator, validate, deleteGroup);

router.post("/:id/add-user", requireAuth, addMemberValidator, validate, addUserToGroup);
router.delete("/:id/members/:memberId", requireAuth, removeMemberValidator, validate, removeUserFromGroup);
router.post("/:id/leave", requireAuth, groupIdValidator, validate, leaveGroup);

router.get("/:id/notes", requireAuth, groupIdValidator, validate, getGroupNotes);
router.post("/:id/notes", requireAuth, createNoteValidator, validate, createGroupNote);
router.delete("/:id/notes/:noteId", requireAuth, deleteNoteValidator, validate, deleteGroupNote);

router.get("/:id/announcements", requireAuth, getAnnouncementsValidator, validate, getGroupAnnouncements);

export default router;
