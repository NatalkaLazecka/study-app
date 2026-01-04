import { body, param } from "express-validator";

export const groupIdValidator = [
  param("id")
    .isUUID()
    .withMessage("Invalid group ID format"),
];

export const memberIdValidator = [
  param("memberId")
    .isUUID()
    .withMessage("Invalid member ID format"),
];

export const noteIdValidator = [
  param("noteId")
    .isUUID()
    .withMessage("Invalid note ID format"),
];

export const fileIdValidator = [
  param("fileId")
    .isUUID()
    .withMessage("Invalid file ID format"),
];

export const createGroupValidator = [
  body("nazwa")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Group name must be between 3 and 255 characters"),

  body("kategoria_grupa_id")
    .optional({ nullable: true })
    .isUUID()
    .withMessage("Invalid category ID format"),
];

export const addMemberValidator = [
  ... groupIdValidator,
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
];

export const removeMemberValidator = [
  ...groupIdValidator,
  ... memberIdValidator,
];

export const transferAdminValidator = [
  ...groupIdValidator,
  body("newAdminId")
    .isUUID()
    .withMessage("Invalid new admin ID format"),
];

export const createNoteValidator = [
  ... groupIdValidator,
  body("tytul")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Note title must be between 3 and 100 characters"),

  body("opis")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 5000 })
    .withMessage("Note description cannot exceed 5000 characters"),
];

export const deleteNoteValidator = [
  ...groupIdValidator,
  ...noteIdValidator,
];

export const getAnnouncementsValidator = [
  ...groupIdValidator,
];