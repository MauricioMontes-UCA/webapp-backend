import { Router } from "express";
import { libraryController } from "../controllers/library.controller.js";

const router = Router();

// estadisticas del usuario 
router.get("/stats/:userId", libraryController.getStats);
// libros por categoria 
router.get("/:userId/:category", libraryController.getBooksByCategory);

export default router;
