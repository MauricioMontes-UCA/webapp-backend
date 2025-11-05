import {Router} from "express"
import { booksController } from "../controllers/books.controller.js"

export const booksRouter = Router()

// booksRouter.get("/search", getBookByParams)

booksRouter.get("/:id", booksController.searchBookById)