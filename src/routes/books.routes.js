import { Router } from "express"
import { booksController } from "../controllers/books.controller.js"
import { validateSearchQuery, validateSearchAdvanced, validateBookId } from "../validators/books.validators.js"

export const booksRouter = Router()

booksRouter.get("/", booksController.getBooks);
booksRouter.post("/search", validateSearchAdvanced, booksController.searchBooksAdvanced);
booksRouter.get("/search/:query", validateSearchQuery, booksController.searchBooks);
booksRouter.get("/:id", validateBookId, booksController.searchBookInfo);