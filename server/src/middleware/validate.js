import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const message = errors
            .array()
            .map(err => err.msg)
            .join(", ");

        return res.status(400).send(message);
    }

    next();
};
