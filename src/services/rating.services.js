import { ratingRepository } from "../repositories/rating.repository.js";
import { validateRatingData, validateRatingUpdate, validateIds } from "../validators/rating.validators.js";

class RatingService {
    /**
     * Crear una nueva calificación
     * @param {Object} ratingData - Datos de la calificación
     * @returns {Promise<Object>} - La calificación creada
     */
    async createRating(ratingData) {
        try {
            // Validar datos
            const validation = validateRatingData(ratingData);
            if (!validation.isValid) {
                const error = new Error("Datos de calificación inválidos");
                error.status = 400;
                error.details = validation.errors;
                throw error;
            }

            // Verificar si el usuario ya calificó este libro
            const existingRating = await ratingRepository.findByUserAndBook(
                ratingData.user_id,
                ratingData.book_id
            );

            if (existingRating) {
                const error = new Error("Ya has calificado este libro. Usa el endpoint de actualización para modificar tu calificación.");
                error.status = 409; // Conflict
                error.existingRating = existingRating;
                throw error;
            }

            // Crear la calificación
            const newRating = await ratingRepository.create({
                user_id: ratingData.user_id,
                google_book_id: ratingData.book_id,
                rating: ratingData.rating,
                review: ratingData.comment || ratingData.review || null
            });

            // Obtener el promedio actualizado del libro
            const bookStats = await ratingRepository.getBookAverageRating(ratingData.book_id);

            return {
                rating: newRating,
                bookStats
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener información completa de rating de un libro
     * @param {string} bookId - ID del libro
     * @param {number} userId - ID del usuario (opcional)
     * @returns {Promise<Object>} - Estadísticas y calificación del usuario si aplica
     */
    async getBookRatingInfo(bookId, userId = null) {
        try {
            // Obtener promedio del libro
            const bookStats = await ratingRepository.getBookAverageRating(bookId);

            const result = {
                bookId,
                averageRating: bookStats.averageRating,
                totalRatings: bookStats.totalRatings,
                userRating: null
            };

            // Si se proporciona userId, obtener su calificación
            if (userId) {
                const userRating = await ratingRepository.findByUserAndBook(userId, bookId);
                result.userRating = userRating;
            }

            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener todas las calificaciones de un libro
     * @param {string} bookId - ID del libro
     * @returns {Promise<Array>} - Lista de calificaciones
     */
    async getBookRatings(bookId) {
        try {
            if (!bookId || typeof bookId !== 'string') {
                const error = new Error("El ID del libro es inválido");
                error.status = 400;
                throw error;
            }

            const ratings = await ratingRepository.findByBook(bookId);
            const bookStats = await ratingRepository.getBookAverageRating(bookId);

            return {
                bookId,
                ratings,
                stats: bookStats
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener todas las calificaciones de un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} - Lista de calificaciones del usuario
     */
    async getUserRatings(userId) {
        try {
            if (!userId || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
                const error = new Error("El ID del usuario es inválido");
                error.status = 400;
                throw error;
            }

            const ratings = await ratingRepository.findByUser(userId);
            return ratings;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualizar una calificación existente
     * @param {number} userId - ID del usuario
     * @param {string} bookId - ID del libro
     * @param {Object} updateData - Datos a actualizar
     * @returns {Promise<Object>} - La calificación actualizada
     */
    async updateRating(userId, bookId, updateData) {
        try {
            // Validar IDs
            const idsValidation = validateIds(userId, bookId);
            if (!idsValidation.isValid) {
                const error = new Error("IDs inválidos");
                error.status = 400;
                error.details = idsValidation.errors;
                throw error;
            }

            // Validar datos de actualización
            const validation = validateRatingUpdate(updateData);
            if (!validation.isValid) {
                const error = new Error("Datos de actualización inválidos");
                error.status = 400;
                error.details = validation.errors;
                throw error;
            }

            // Actualizar la calificación
            const updatedRating = await ratingRepository.update(userId, bookId, {
                rating: updateData.rating,
                review: updateData.comment || updateData.review
            });

            if (!updatedRating) {
                const error = new Error("No se encontró una calificación para este usuario y libro");
                error.status = 404;
                throw error;
            }

            // Obtener el promedio actualizado del libro
            const bookStats = await ratingRepository.getBookAverageRating(bookId);

            return {
                rating: updatedRating,
                bookStats
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Eliminar una calificación
     * @param {number} userId - ID del usuario
     * @param {string} bookId - ID del libro
     * @returns {Promise<Object>} - Confirmación de eliminación
     */
    async deleteRating(userId, bookId) {
        try {
            // Validar IDs
            const validation = validateIds(userId, bookId);
            if (!validation.isValid) {
                const error = new Error("IDs inválidos");
                error.status = 400;
                error.details = validation.errors;
                throw error;
            }

            const deleted = await ratingRepository.delete(userId, bookId);

            if (!deleted) {
                const error = new Error("No se encontró una calificación para este usuario y libro");
                error.status = 404;
                throw error;
            }

            // Obtener el promedio actualizado del libro
            const bookStats = await ratingRepository.getBookAverageRating(bookId);

            return {
                message: "Calificación eliminada exitosamente",
                bookStats
            };
        } catch (error) {
            throw error;
        }
    }
}

export const ratingService = new RatingService();
