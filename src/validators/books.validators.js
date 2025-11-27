import { param, body, validationResult } from "express-validator";

/**
 * Validador para el parámetro query en búsqueda simple
 * GET /api/books/search/:query
 */
export const validateSearchQuery = [
    param("query")
        .notEmpty()
        .trim()
        .isLength({ min: 1 }).withMessage("No se ingresado un término para la búsqueda"),

    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                code: 400,
                errors: errors.array().map(err => err.msg)
            });
        }
        next();
    }
];

/**
 * Validador para búsqueda avanzada
 * POST /api/books/search
 */
export const validateSearchAdvanced = [
    body()
        .notEmpty().withMessage("No hay parámetros ingresados para la búsqueda")
        .bail()
        .custom((value, { req }) => {
            const { title, author, publisher, subject, isbn, keywords } = req.body

            if (!title && !author && !publisher && !subject && !isbn && !keywords) {
                throw new Error("Debe proporcionar al menos un parámetro de búsqueda válido");
            }
            return true;
        }),

    // Validar campos opcionales si existen
    body("title")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("El título no puede estar vacío."),

    body("author")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("El autor no puede estar vacío."),

    body("publisher")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("La editorial no puede estar vacía."),

    body("subject")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("El tema no puede estar vacío."),

    body("isbn")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("El ISBN no puede estar vacío."),

    body("keywords")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("Las palabras clave no pueden estar vacías."),

    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                code: 400,
                errors: errors.array().map(err => err.msg)
            });
        }
        next();
    }
];

/**
 * Validador para obtener información de un libro
 * GET /api/books/:id
 */
export const validateBookId = [
    param("id")
        .trim()
        .notEmpty().withMessage("No se ha ingresado un ID para el libro.")
        .bail()
        .isLength({ min: 1 }).withMessage("El ID del libro no puede estar vacío."),

    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                code: 400,
                errors: errors.array().map(err => err.msg)
            });
        }
        next();
    }
];
