import { ratingService } from "../services/rating.services.js";

class RatingController {
    /**
     * POST /api/ratings
     * Crear una nueva calificación
     * Body: { book_id, rating, comment? }
     * El user_id se obtiene de req.user (autenticación)
     */
    async createRating(req, res) {
        try {
            const { book_id, rating, comment } = req.body;
            const user_id = req.user.id;

            const result = await ratingService.createRating({
                user_id,
                book_id,
                rating,
                comment
            });

            res.status(201).json({
                message: "Calificación creada exitosamente",
                data: result
            });
        } catch (error) {
            console.error("Error en createRating:", error.message);

            const status = error.status || 500;
            res.status(status).json({
                message: error.message || "Error interno del servidor",
                details: error.details || null,
                existingRating: error.existingRating || null
            });
        }
    }

    /**
     * GET /api/ratings/book/:bookId
     * Obtener todas las calificaciones de un libro
     * Devuelve info completa: promedio + calificación del usuario autenticado
     */
    async getBookRatings(req, res) {
        try {
            const { bookId } = req.params;
            const userId = req.user.id;

            // Devolver info completa (promedio + calificación del usuario autenticado)
            const result = await ratingService.getBookRatingInfo(bookId, userId);

            res.status(200).json({
                message: "Calificaciones obtenidas exitosamente",
                data: result
            });
        } catch (error) {
            console.error("Error en getBookRatings:", error.message);

            const status = error.status || 500;
            res.status(status).json({
                message: error.message || "Error interno del servidor"
            });
        }
    }

    /**
     * GET /api/ratings/book/:bookId/stats
     * Obtener estadísticas de calificación de un libro (promedio y total)
     * Incluye la calificación del usuario autenticado
     */
    async getBookRatingStats(req, res) {
        try {
            const { bookId } = req.params;
            const userId = req.user.id;

            const result = await ratingService.getBookRatingInfo(bookId, userId);

            res.status(200).json({
                message: "Estadísticas obtenidas exitosamente",
                data: result
            });
        } catch (error) {
            console.error("Error en getBookRatingStats:", error.message);

            const status = error.status || 500;
            res.status(status).json({
                message: error.message || "Error interno del servidor"
            });
        }
    }

    /**
     * GET /api/ratings/user/me
     * Obtener todas las calificaciones del usuario autenticado
     */
    async getUserRatings(req, res) {
        try {
            const userId = req.user.id;

            const ratings = await ratingService.getUserRatings(userId);

            res.status(200).json({
                message: "Calificaciones del usuario obtenidas exitosamente",
                data: {
                    userId: userId,
                    ratings,
                    total: ratings.length
                }
            });
        } catch (error) {
            console.error("Error en getUserRatings:", error.message);

            const status = error.status || 500;
            res.status(status).json({
                message: error.message || "Error interno del servidor"
            });
        }
    }

    /**
     * PUT /api/ratings
     * Actualizar una calificación existente
     * Body: { book_id, rating?, comment? }
     * El user_id se obtiene de req.user (autenticación)
     */
    async updateRating(req, res) {
        try {
            const { book_id, rating, comment } = req.body;
            const user_id = req.user.id;

            const updateData = {};
            if (rating !== undefined) updateData.rating = rating;
            if (comment !== undefined) updateData.comment = comment;

            const result = await ratingService.updateRating(user_id, book_id, updateData);

            res.status(200).json({
                message: "Calificación actualizada exitosamente",
                data: result
            });
        } catch (error) {
            console.error("Error en updateRating:", error.message);

            const status = error.status || 500;
            res.status(status).json({
                message: error.message || "Error interno del servidor",
                details: error.details || null
            });
        }
    }

    /**
     * DELETE /api/ratings
     * Eliminar una calificación
     * Body: { book_id }
     * El user_id se obtiene de req.user (autenticación)
     */
    async deleteRating(req, res) {
        try {
            const { book_id } = req.body;
            const user_id = req.user.id;

            const result = await ratingService.deleteRating(user_id, book_id);

            res.status(200).json({
                message: result.message,
                data: {
                    bookStats: result.bookStats
                }
            });
        } catch (error) {
            console.error("Error en deleteRating:", error.message);

            const status = error.status || 500;
            res.status(status).json({
                message: error.message || "Error interno del servidor",
                details: error.details || null
            });
        }
    }
}

export const ratingController = new RatingController();
