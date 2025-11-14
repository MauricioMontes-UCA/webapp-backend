import { userService } from "../services/users.services.js";

class UserController {

    // se tiene que trabajar con un POST
    async registerUser(req, res) {
        try {
            const user = await userService.registerUser(req.body);

            console.info("Usuario creado exitosamente");

            res.status(201).json(user)
        }
        catch (err) {
            console.error("Error en el controlador", err.message);

            const status = err.status || 500;

            res.status(status).json({ 
                message: err.message || "Error interno del servidor",
                code: status
            });
        }
    }
}

export const userController = new UserController();