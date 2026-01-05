import {body, param} from "express-validator";


export const taskIdValidator = [
    param("id")
        .isUUID()
        .withMessage("Invalid task id"),
];


export const createTaskValidator = [
    body("tytul")
        .trim()
        .isLength({min: 3})
        .withMessage("Title must have at least 3 characters"),

    body("deadline")
        .isISO8601()
        .withMessage("Invalid deadline"),

    body("priorytet")
        .optional()
        .isInt({min: 1, max: 3}),

    body("wysilek")
        .optional()
        .isInt({min: 1, max: 4}),

    body("automatyczne_powiadomienie")
        .optional()
        .isIn([0, 1]),

    body("tryby_powiadomien")
        .optional()
        .isArray(),

    body("tryby_powiadomien.*")
        .optional()
        .isUUID()
        .withMessage("Notification mode ID must be UUID"),
];


export const updateTaskValidator = [
    ...taskIdValidator,
    ...createTaskValidator,
];
