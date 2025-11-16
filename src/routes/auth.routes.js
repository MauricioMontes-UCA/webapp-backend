import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", authController.loginUser);
authRouter.post("/logout", authController.logoutUser);