import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", authController.loginUser);

// No borra nada realmente, o bueno, solo el token de autenticación
authRouter.delete("/logout", authController.logoutUser);