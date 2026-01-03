import { body, param } from "express-validator";


export const idParamValidator = (name = "id") => [
  param(name)
    .isUUID()
    .withMessage(`Invalid ${name} format`),
];

export const createEventValidator = [
  body("tytul")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must have at least 3 characters"),

  body("opis")
    .optional()
    .isString(),

  body("data_start")
    .isISO8601()
    .withMessage("Invalid start date"),

  body("data_koncowa")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date"),


  body("rodzaj_wydarzenia_id")
    .isUUID()
    .withMessage("Invalid event category id"),

  body("rodzaj_powtarzania_id")
    .optional()
    .isUUID()
    .withMessage("Invalid repeat type id"),

  body("automatyczne_powiadomienia")
    .optional()
    .isIn([0, 1])
    .withMessage("Automatic notifications must be 0 or 1"),
];


export const updateEventValidator = [
  ...idParamValidator("id"),
  ...createEventValidator,
];


export const eventIdParamValidator = [
  param("eventId")
    .isUUID()
    .withMessage("Invalid eventId"),
];

export const fileIdParamValidator = [
  param("fileId")
    .isUUID()
    .withMessage("Invalid fileId"),
    ];
