import { body, param } from "express-validator";


export const idParamValidator = [
  param("id")
    .isUUID()
    .withMessage("Invalid ID format"),
];


export const createScheduleValidator = [
  body("przedmiot_id")
    .isUUID()
    .withMessage("Invalid subject id"),

  body("prowadzacy_id")
    .isUUID()
    .withMessage("Invalid professor id"),

  body("dzien_tygodnia")
    .isIn([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
    .withMessage("Invalid day of week"),

  body("godzina")
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("Invalid time format (HH:MM)"),

  body("sala")
    .trim()
    .notEmpty()
    .withMessage("Room is required"),

  body("typ_zajec_id")
    .isUUID()
    .withMessage("Invalid class type id"),
];

export const updateScheduleValidator = [
  ...idParamValidator,
  ...createScheduleValidator,
];


export const createProfessorValidator = [
  body("imie")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must have at least 2 characters"),

  body("nazwisko")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must have at least 2 characters"),
];

export const updateProfessorValidator = [
  ...idParamValidator,
  ...createProfessorValidator,
];


export const createSubjectValidator = [
  body("nazwa")
    .trim()
    .notEmpty()
    .withMessage("Subject name is required"),
];

export const updateSubjectValidator = [
  ...idParamValidator,
  body("nazwa")
    .trim()
    .notEmpty()
    .withMessage("Subject name is required"),
];
