import Rating from "../models/rating.model.js";
import { sequelize } from "./db/connection.js";

class RatingRepository {
    /**
     * Crear una nueva calificación
     * @param {Object} ratingData - Datos de la calificación
     * @returns {Promise<Object>} - La calificación creada
     */
    async create(ratingData) {
        try {
            const newRating = await Rating.create(ratingData);
            return newRating;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verificar si el usuario ya calificó un libro
     * @param {number} userId - ID del usuario
     * @param {string} bookId - ID del libro
     * @returns {Promise<Object|null>} - La calificación si existe, null si no
     */
    async findByUserAndBook(userId, bookId) {
        try {
            const rating = await Rating.findOne({
                where: {
                    user_id: userId,
                    google_book_id: bookId
                }
            });
            return rating;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener todas las calificaciones de un libro
     * @param {string} bookId - ID del libro
     * @returns {Promise<Array>} - Lista de calificaciones
     */
    async findByBook(bookId) {
        try {
            const ratings = await Rating.findAll({
                where: { google_book_id: bookId },
                order: [['created_at', 'DESC']]
            });
            return ratings;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener todas las calificaciones de un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} - Lista de calificaciones
     */
    async findByUser(userId) {
        try {
            const ratings = await Rating.findAll({
                where: { user_id: userId },
                order: [['created_at', 'DESC']]
            });
            return ratings;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener el promedio de calificación de un libro
     * @param {string} bookId - ID del libro
     * @returns {Promise<Object>} - Promedio y cantidad de calificaciones
     */
    async getBookAverageRating(bookId) {
        try {
            const [result] = await sequelize.query(
                `SELECT 
                    AVG(CAST(rating AS FLOAT)) as average_rating,
                    COUNT(*) as total_ratings
                FROM book_reviews 
                WHERE google_book_id = :bookId AND rating IS NOT NULL`,
                {
                    replacements: { bookId },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            return {
                averageRating: result.average_rating ? parseFloat(result.average_rating).toFixed(1) : null,
                totalRatings: result.total_ratings
            };
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
    async update(userId, bookId, updateData) {
        try {
            const rating = await Rating.findOne({
                where: {
                    user_id: userId,
                    google_book_id: bookId
                }
            });

            if (!rating) {
                return null;
            }

            await rating.update(updateData);

            return rating;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Eliminar una calificación
     * @param {number} userId - ID del usuario
     * @param {string} bookId - ID del libro
     * @returns {Promise<boolean>} - true si se eliminó, false si no existía
     */
    async delete(userId, bookId) {
        try {
            const deleted = await Rating.destroy({
                where: {
                    user_id: userId,
                    google_book_id: bookId
                }
            });
            return deleted > 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener calificación por ID
     * @param {number} id - ID de la calificación
     * @returns {Promise<Object|null>} - La calificación o null
     */
    async findById(id) {
        try {
            const rating = await Rating.findByPk(id);
            return rating;
        } catch (error) {
            throw error;
        }
    }
}

export const ratingRepository = new RatingRepository();
