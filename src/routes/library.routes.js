import { Router } from "express";
import { libraryController } from "../controllers/library.controller.js";
import { authenticateToken } from "../middlewares/middlewares.js";

const router = Router();

// estadísticas del usuario autenticado
router.get("/stats", authenticateToken, libraryController.getStats);

// libros por categoría del usuario autenticado
router.get("/:category", authenticateToken, libraryController.getBooksByCategory);

export default router;
