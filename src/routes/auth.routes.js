import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateCredentialsBody } from "../validators/auth.validators.js";
import { authenticateToken } from "../middlewares/middlewares.js";

export const authRouter = Router();

authRouter.post("/login", validateCredentialsBody, authController.loginUser);

authRouter.get("/", authenticateToken, authController.isAuthenticated);

// No borra nada realmente, o bueno, solo el token de autenticación
authRouter.delete("/logout", authController.logoutUser);