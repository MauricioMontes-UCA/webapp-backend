import { Router } from "express"
import { userController } from "../controllers/users.controller.js";

export const userRouter = Router();

// POST /api/users/
userRouter.post("/", userController.registerUser);

// GET /api/users?email= || GET /api/users
userRouter.get("/", userController.getUsers);

// GET /api/users/:id
userRouter.get("/:id", userController.searchUserById);

// PATCH /api/users/:id
userRouter.patch("/:id", userController.updateUser);

// DELETE /api/users/:id
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;