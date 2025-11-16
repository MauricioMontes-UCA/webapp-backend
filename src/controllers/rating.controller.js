import { ratingService } from "../services/rating.services.js";

class RatingController {
    /**
     * POST /api/ratings
     * Crear una nueva calificación
     * Body: { user_id, book_id, rating, comment? }
     */
    async createRating(req, res) {
        try {
            const { user_id, book_id, rating, comment } = req.body;

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
     * Query params: ?userId=123 (opcional)
     */
    async getBookRatings(req, res) {
        try {
            const { bookId } = req.params;
            const { userId } = req.query;

            let result;
            if (userId) {
                // Si se proporciona userId, devolver info completa (promedio + calificación del usuario)
                result = await ratingService.getBookRatingInfo(bookId, parseInt(userId));
            } else {
                // Solo las calificaciones del libro
                result = await ratingService.getBookRatings(bookId);
            }

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
     * Query params: ?userId=123 (opcional, para incluir calificación del usuario)
     */
    async getBookRatingStats(req, res) {
        try {
            const { bookId } = req.params;
            const { userId } = req.query;

            const result = await ratingService.getBookRatingInfo(
                bookId, 
                userId ? parseInt(userId) : null
            );

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
     * GET /api/ratings/user/:userId
     * Obtener todas las calificaciones de un usuario
     */
    async getUserRatings(req, res) {
        try {
            const { userId } = req.params;

            const ratings = await ratingService.getUserRatings(parseInt(userId));

            res.status(200).json({
                message: "Calificaciones del usuario obtenidas exitosamente",
                data: {
                    userId: parseInt(userId),
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
     * Body: { user_id, book_id, rating?, comment? }
     */
    async updateRating(req, res) {
        try {
            const { user_id, book_id, rating, comment } = req.body;

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
     * Body: { user_id, book_id }
     */
    async deleteRating(req, res) {
        try {
            const { user_id, book_id } = req.body;

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
