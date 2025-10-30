import {Router} from "express"
import BooksController from "../controllers/books.controller.js"

export const booksRouter = Router()

// booksRouter.get("/search", getBookByParams)

booksRouter.get("/:id", BooksController.searchBookById)