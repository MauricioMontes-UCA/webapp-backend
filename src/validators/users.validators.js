import { body, validationResult } from "express-validator";

export const validateRegisterBody = [
    body()
        .notEmpty().withMessage("No hay parámetros para el registro"),

    body("username")
        .trim()
        .isLength({ min: 1 }).withMessage("username no puede estar vacío."),

    body("email")
        .trim()
        .isLength({ min: 1 }).withMessage("email no puede estar vacío.")
        .bail()
        .isEmail().withMessage("El correo ingresado no es válido")
        .bail()
        .normalizeEmail(),

    body("password")
        .trim()
        .isLength({ min: 1 }).withMessage("password no puede estar vacía.")
        .bail()
        .isStrongPassword({
            minNumbers: 1,
            minLength: 12,
            minSymbols: 1,
            minLowercase: 1,
            minUppercase: 1,
        }).withMessage("La contraseña debe tener mayúsculas, minúsculas, un símbolo especial y 12 caracteres"),

    body("first_name")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("first_name no puede estar vacío"),

    body("last_name")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("last_name no puede estar vacío."),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                code: 400,
                errors: errors.array().map(err => err.msg)
            })
        }
        next();
    }
];

export const validateUpdateBody = [
    body()
        .notEmpty().withMessage("No hay parámetros para el registro"),

    body("username")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("username no puede estar vacío."),

    body("email")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("email no puede estar vacío.")
        .bail()
        .isEmail().withMessage("El correo ingresado no es válido")
        .bail()
        .normalizeEmail(),

    body("password")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("password no puede estar vacía.")
        .bail()
        .isStrongPassword({
            minNumbers: 1,
            minLength: 12,
            minSymbols: 1,
            minLowercase: 1,
            minUppercase: 1,
        }).withMessage("La contraseña debe tener mayúsculas, minúsculas, un símbolo especial y 12 caracteres"),

    body("first_name")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("firstname no puede estar vacío"),

    body("last_name")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("lastname no puede estar vacío."),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                code: 400,
                errors: errors.array().map(err => err.msg)
            })
        }
        next();
    }   
]