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

    // no estoy seguro si esto será usado, talvez en algún futuro...
    // de momento solo es para pruebas
    async searchUserById(req, res) {
        try {
            const userId = req.params.id
            const user = await userService.findUserById(userId);

            console.info("Usuario encontrado");

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Error en el controlador", err.message);
            
            const status = err.status || 500;

            res.status(status).json({
                message: err.message || "Error interno del servidor",
                code: status
            })
        }
    }
    
    // Buscar usuario por email usando query param ?email=...
    // No creo que sea usada por el frontend, pero sirve para pruebas supongo
    async searchUserByEmail(req, res) {
        try {
            const { email } = req.query;
            if (!email) {
                return res.status(400).json({ 
                    message: "Falta el parámetro 'email'", 
                    code: 400 
                });
            }
            const user = await userService.findUserByEmail(email);
            
            console.info("Usuario encontrado");

            res.status(200).json(user);
        }
        catch (err) {
            console.error("Error en el controlador", err.message);

            const status = err.status // || 500;

            res.status(status).json({
                message: err.message || "Error interno del servidor",
                code: status
            });
        }
    }

    // se tiene que trabajar con un PATCH, y también un parámetro id
    // la ruta probablemente sea del estilo PATCH users/:id
    async updateUser(req, res) {
        try {
            const userId = req.params.id
            const updatedUser = await userService.updateUser(userId, req.body);
            
            console.info("Usuario actualizado exitosamente");

            res.status(200).json(updatedUser)
        } 
        catch (err) {
            console.error("Error en el controlador", err.message);
            
            const status = err.status || 500;

            res.status(status).json({
                message: err.message || "Error interno del servidor",
                code: status
            })
        }
    }
    
    // Elimina un usuario por id (DELETE /users/:id)
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const result = await userService.deleteUser(userId);
            console.info("Usuario eliminado correctamente");
            res.status(200).json(result);
        } catch (err) {
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