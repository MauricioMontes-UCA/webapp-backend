import { Router } from "express";
import { ratingController } from "../controllers/rating.controller.js";

export const ratingRouter = Router();

// Crear una nueva calificación
ratingRouter.post("/", ratingController.createRating);

// Actualizar una calificación existente
ratingRouter.put("/", ratingController.updateRating);

// Eliminar una calificación
ratingRouter.delete("/", ratingController.deleteRating);

// Obtener todas las calificaciones de un libro (con opción de incluir userId)
ratingRouter.get("/book/:bookId", ratingController.getBookRatings);

// Obtener estadísticas de calificación de un libro
ratingRouter.get("/book/:bookId/stats", ratingController.getBookRatingStats);

// Obtener todas las calificaciones de un usuario
ratingRouter.get("/user/:userId", ratingController.getUserRatings);
