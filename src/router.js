import {Router} from "express"
import {booksRouter} from "./routes/books.routes.js"
import {ratingRouter} from "./routes/rating.routes.js"

const router = Router()

router.use("/books", booksRouter)
router.use("/ratings", ratingRouter)

export default router;