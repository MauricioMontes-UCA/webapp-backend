import {Router} from "express"
import {booksRouter} from "./routes/books.routes.js"

const router = Router()

router.use("/books", booksRouter)

export default router;