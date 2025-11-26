import { Router } from "express";
import { authenticateToken } from "../middlewares/middlewares.js";
import { listController } from "../controllers/lists.controller.js";

export const listsRouter = Router();

listsRouter.get("/me", authenticateToken, listController.getUserLibrary);

listsRouter.post("/book", authenticateToken, listController.addBookToList);

listsRouter.put("/book", authenticateToken, listController.moveBookToList);

listsRouter.delete("/book/:id", authenticateToken, listController.removeBookFromList);