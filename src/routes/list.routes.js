import { Router } from "express";
import { readingListController } from "../controllers/list.controller.js";

const router = Router();

//lista de usuario 
router.get("/user/:userId", readingListController.getListsByUser);

//libros de una lista
router.get("/:listId/books", readingListController.getBooksInList);

//agregar libro a una lista
router.post("/:listId/books", readingListController.addBookToList);

// quitar libro
router.delete("/:listId/books", readingListController.removeBookFromList);

export default router;
