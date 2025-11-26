import { Router } from "express"
import { booksRouter } from "./routes/books.routes.js"
import { userRouter } from "./routes/users.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { readingListRouter } from "./routes/list.routes.js";
import { libraryRouter } from "./routes/library.routes.js"
import { ratingRouter } from "./routes/rating.routes.js";

const router = Router();

router.use("/books", booksRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/library", libraryRouter);
router.use("/lists", readingListRouter);
router.use("/ratings", ratingRouter);

export default router;