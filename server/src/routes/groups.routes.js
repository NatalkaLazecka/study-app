import express from "express";
import {
    getGroups,
    createGroup,
    getGroupDetails,
    addUserToGroup,
    deleteGroup,
} from "../controllers/groups.controller.js";

const router = express.Router();


router.get("/student/:studentId", getGroups);
router.post("/student/:studentId", createGroup);

router.get("/:id", getGroupDetails);
router.post("/:id/add-user", addUserToGroup);
router.delete("/:id", deleteGroup);

export default router;
