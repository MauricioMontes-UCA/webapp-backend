import { Router } from "express"
import { userController } from "../controllers/users.controller.js";
import { authenticateToken } from "../middlewares/middlewares.js";

export const userRouter = Router();

// POST /api/users/ - Registro público (no requiere autenticación)
userRouter.post("/", userController.registerUser);

// GET /api/users/me - Obtiene el perfil del usuario autenticado
userRouter.get("/me", authenticateToken, userController.getMyProfile);

// GET /api/users?email= || GET /api/users
// userRouter.get("/", userController.getUsers);

// GET /api/users/:id
// userRouter.get("/:id", userController.searchUserById);

// PATCH /api/users/me - El usuario actualiza su propio perfil
userRouter.patch("/me", authenticateToken, userController.updateUser);

// DELETE /api/users/me - El usuario elimina su propia cuenta
userRouter.delete("/me", authenticateToken, userController.deleteUser);

export default userRouter;