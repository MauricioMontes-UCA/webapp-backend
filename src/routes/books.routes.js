import {Router} from "express"
import { booksController } from "../controllers/books.controller.js"

export const booksRouter = Router()

booksRouter.get("/", booksController.getBooks);
booksRouter.post("/search", booksController.searchBooksAdvanced);
booksRouter.get("/search/:query", booksController.searchBooks);
booksRouter.get("/:id", booksController.searchBookInfo);