import { Router } from "express"
import { userController } from "../controllers/users.controller.js";

export const userRouter = Router();

userRouter.post("/", userController.registerUser);