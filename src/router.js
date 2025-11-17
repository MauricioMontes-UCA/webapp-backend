import {Router} from "express"
import {booksRouter} from "./routes/books.routes.js"
import { userRouter } from "./routes/users.routes.js";
import { authRouter } from "./routes/auth.routes.js";

const router = Router();

router.use("/books", booksRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router;