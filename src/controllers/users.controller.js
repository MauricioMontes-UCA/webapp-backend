import { userService } from "../services/users.services.js";

class UserController {

    // se trabaja con un POST, el cuerpo es el siemplemente el correo y la contraseña
    async loginUser(req, res) {

    }


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

    // Buscar usuarios. Si se provee un email en el query param, busca por email.
    // Si no, devuelve todos los usuarios.
    async getUsers(req, res) {
        try {
            const { email } = req.query;
            let users;

            if (email) {
                users = await userService.findUserByEmail(email);
                console.info("Usuario encontrado por email");
            } else {
                users = await userService.getAllUsers();
                console.info("Todos los usuarios encontrados");
            }

            res.status(200).json(users);
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