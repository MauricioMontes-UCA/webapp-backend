import { Router } from "express";
import { readingListController } from "../controllers/list.controller.js";
import { authenticateToken } from "../middlewares/middlewares.js";

export const readingListRouter = Router();




//lista del usuario autenticado
readingListRouter.get("/user/me", authenticateToken, readingListController.getListsByUser);

//libros de una lista
readingListRouter.get("/:listId/books", authenticateToken, readingListController.getBooksInList);

//agregar libro a una lista
readingListRouter.post("/:listId/books", authenticateToken, readingListController.addBookToList);

// quitar libro
readingListRouter.delete("/:listId/books", authenticateToken, readingListController.removeBookFromList);
