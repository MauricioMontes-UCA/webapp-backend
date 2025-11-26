import { body, validationResult } from "express-validator";

export const validateCredentialsBody = [
    body("email")
        .notEmpty().withMessage("El correo no puede estar vacío")
        .bail()
        .trim()
        .isLength({ min: 1 }).withMessage("El correo no puede estar vacío")
        .bail()
        .isEmail().withMessage("El correo ingresado no es el válido")
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("La contraseña no puede estar vacía")
        .bail()
        .trim()
        .isLength({ min: 1 }).withMessage("La contraseña no puede estar vacía"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({
                code: 400,
                errors: errors.array().map(err => err.msg)
            });
        }
        next();
    }
]