/**
 * Validadores para el servicio de Rating
 */

/**
 * Valida los datos para crear o actualizar una calificación
 * @param {Object} data - Datos de la calificación
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
export function validateRatingData(data) {
    const errors = [];

    // Validar que exista el rating
    if (data.rating === undefined || data.rating === null) {
        errors.push("El campo 'rating' es obligatorio");
    } else {
        // Validar que sea un número
        const ratingNum = parseFloat(data.rating);
        if (isNaN(ratingNum)) {
            errors.push("El campo 'rating' debe ser un número");
        } else if (ratingNum < 1 || ratingNum > 5) {
            errors.push("El campo 'rating' debe estar entre 1 y 5");
        } else if (!Number.isInteger(ratingNum * 2)) {
            // Permite solo incrementos de 0.5 (1, 1.5, 2, 2.5, etc.)
            errors.push("El campo 'rating' solo permite valores enteros o con .5 (ej: 3, 3.5, 4)");
        }
    }

    // Validar user_id
    if (!data.user_id) {
        errors.push("El campo 'user_id' es obligatorio");
    } else if (!Number.isInteger(data.user_id) || data.user_id <= 0) {
        errors.push("El campo 'user_id' debe ser un número entero positivo");
    }

    // Validar book_id
    if (!data.book_id || typeof data.book_id !== 'string') {
        errors.push("El campo 'book_id' es obligatorio y debe ser una cadena de texto");
    } else if (data.book_id.trim().length === 0) {
        errors.push("El campo 'book_id' no puede estar vacío");
    } else if (data.book_id.length > 100) {
        errors.push("El campo 'book_id' no puede tener más de 100 caracteres");
    }

    // Validar comment (opcional) - ahora se llama review en la BD pero mantenemos la interfaz
    if (data.comment !== undefined && data.comment !== null) {
        if (typeof data.comment !== 'string') {
            errors.push("El campo 'comment' debe ser una cadena de texto");
        }
    }

    // Validar review (por si viene con ese nombre también)
    if (data.review !== undefined && data.review !== null) {
        if (typeof data.review !== 'string') {
            errors.push("El campo 'review' debe ser una cadena de texto");
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Valida los datos para actualizar una calificación
 * @param {Object} data - Datos a actualizar
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
export function validateRatingUpdate(data) {
    const errors = [];

    // Al menos uno de los campos debe estar presente
    if (!data.rating && !data.comment) {
        errors.push("Debe proporcionar al menos 'rating' o 'comment' para actualizar");
    }

    // Validar rating si está presente
    if (data.rating !== undefined && data.rating !== null) {
        const ratingNum = parseFloat(data.rating);
        if (isNaN(ratingNum)) {
            errors.push("El campo 'rating' debe ser un número");
        } else if (ratingNum < 1 || ratingNum > 5) {
            errors.push("El campo 'rating' debe estar entre 1 y 5");
        } else if (!Number.isInteger(ratingNum * 2)) {
            errors.push("El campo 'rating' solo permite valores enteros o con .5 (ej: 3, 3.5, 4)");
        }
    }

    // Validar comment si está presente
    if (data.comment !== undefined && data.comment !== null) {
        if (typeof data.comment !== 'string') {
            errors.push("El campo 'comment' debe ser una cadena de texto");
        }
    }

    // Validar review si está presente
    if (data.review !== undefined && data.review !== null) {
        if (typeof data.review !== 'string') {
            errors.push("El campo 'review' debe ser una cadena de texto");
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Valida los parámetros de ID
 * @param {number} userId - ID del usuario
 * @param {string} bookId - ID del libro
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
export function validateIds(userId, bookId) {
    const errors = [];

    if (!userId || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
        errors.push("El 'user_id' debe ser un número entero positivo");
    }

    if (!bookId || typeof bookId !== 'string' || bookId.trim().length === 0) {
        errors.push("El 'book_id' es obligatorio y debe ser una cadena de texto válida");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
