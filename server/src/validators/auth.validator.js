import { body } from "express-validator";


export const loginValidator = [
  body("e_mail")
    .isEmail()
    .withMessage("Invalid email"),

  body("haslo")
    .isLength({ min: 6 })
    .withMessage("Password must have at least 6 characters"),
];


export const registerValidator = [
  body("imie")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),

  body("nazwisko")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),

  body("e_mail")
    .isEmail()
    .withMessage("Invalid email"),

  body("haslo")
    .isLength({ min: 6 })
    .withMessage("Password must have at least 6 characters"),

  body("haslo2")
    .custom((value, { req }) => {
      if (value !== req.body.haslo) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
