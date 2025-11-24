import { Router } from "express";
import { readingListController } from "../controllers/list.controller.js";
import { authenticateToken } from "../middlewares/middlewares.js";

const router = Router();

//lista del usuario autenticado
router.get("/user/me", authenticateToken, readingListController.getListsByUser);

//libros de una lista
router.get("/:listId/books", authenticateToken, readingListController.getBooksInList);

//agregar libro a una lista
router.post("/:listId/books", authenticateToken, readingListController.addBookToList);

// quitar libro
router.delete("/:listId/books", authenticateToken, readingListController.removeBookFromList);

export default router;
