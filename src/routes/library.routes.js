import { Router } from "express";
import { libraryController } from "../controllers/library.controller.js";
import { authenticateToken } from "../middlewares/middlewares.js";

export const libraryRouter = Router();

// estadísticas del usuario autenticado
libraryRouter.get("/stats", authenticateToken, libraryController.getStats);

// libros por categoría del usuario autenticado
libraryRouter.get("/:category", authenticateToken, libraryController.getBooksByCategory);