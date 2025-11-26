import { Router } from "express";
import { ratingController } from "../controllers/rating.controller.js";
import { authenticateToken } from "../middlewares/middlewares.js";

export const ratingRouter = Router();

// Crear una nueva calificación
ratingRouter.post("/", authenticateToken, ratingController.createRating);

// Actualizar una calificación existente
ratingRouter.put("/", authenticateToken, ratingController.updateRating);

// Eliminar una calificación
ratingRouter.delete("/", authenticateToken, ratingController.deleteRating);

// Obtener todas las calificaciones de un libro + calificación del usuario autenticado
ratingRouter.get("/book/:bookId", authenticateToken, ratingController.getBookRatings);

// Obtener estadísticas de calificación de un libro
ratingRouter.get("/book/:bookId/stats", authenticateToken, ratingController.getBookRatingStats);

// Obtener todas las calificaciones del usuario autenticado
ratingRouter.get("/user/me", authenticateToken, ratingController.getUserRatings);
