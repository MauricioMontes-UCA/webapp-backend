import { UniqueConstraintError } from "sequelize";
import { userRepository } from "../repositories/user.repository.js";
import { hashPassword } from "../utils/users.utils.js";
import { ServiceError } from "./service.error.js";
import { generateToken } from "../utils/auth.utils.js";

class UserService {
    async registerUser(userData) {
        try {
            // Lógica de negocios:
            const data = { ...userData };
            
            // Encripta la contraseña en un hash
            const hashedPassword = await hashPassword(data.password);
            data.password_hash = hashedPassword;
            delete data.password;

            // Crea el nuevo usuario
            const newUser = await userRepository.createUser(data);
            delete newUser.password_hash;

            return {
                // Genera un token de inicio de sesión 
                token: generateToken(newUser.id, newUser.username, newUser.email),
                user: newUser
            };
        } 
        catch (err) {
            // Si el correo ya está registrado, tira este error
            if (err instanceof UniqueConstraintError) { 
                throw new ServiceError("El correo ya está registrado en la base de datos", 409);
            }
            // Si ya es un ServiceError, relanzar tal cual
            if (err instanceof ServiceError) {
                throw err;
            }
            throw new ServiceError("Error al crear el usuario: " + err.message, 500);
        }
    }

    // El objeto a recibir, en teoría, puede ser un objeto con cualquier de estos atributos:
    // {
    //     "username": String,
    //     "email": String,
    //     "first_name": String,
    //     "last_name": String
    //     "password": String,
    // }
    // Tal que, solo estén los objetos que se van a actualizar.

    async updateUser(userId, updateData) {
        try {
            let user = await userRepository.selectUserById(userId)
            if (!user) {
                throw new ServiceError("No se encontró el usuario para actualizar", 404);
            }

            // const allowedFields = ["first_name", "last_name", "username", "email", "password"];
            const data = { ...updateData };

            // // Obtiene los datos del objeto y se queda con los que no son espacios vacíos
            // // Además de filtrar cualquier otra entrada que no sean las permitidas...
            // for (const field of allowedFields) {
            //     if (Object.prototype.hasOwnProperty.call(updateData, field)) {
            //         const value = updateData[field];
            //         if (typeof value === "string" && value.trim() !== "") {
            //             data[field] = value;
            //         }
            //     }
            // }

            // Verifica si uno de los datos a actualizar es el email...
            if (data.email) {

            //     // Si el formato del email es válido...
            //     if (!verifyValidEmail(data.email)) {
            //         throw new ServiceError("El correo no tiene un formato válido", 400);
            //     }

                // Y si no está siendo usado por otro usuario
                user = await userRepository.selectUserByEmail(data.email);
                if (user && user.id !== userId) {
                    throw new ServiceError("El correo ya está siendo utilizado por otro usuario", 409)
                }
            }                        

            // Si una de los datos a actualizar es la contraseña...
            if (data.password) {
                // Verifica si es una contraseña válida...
                // const validation = verifyValidPassword(data.password);
                // if (!validation.isValid) {
                //     // En caso de no serlo, menciona qué condición no se ha cumplido...
                //     throw new ServiceError("La contraseña no es válida: " + validation.message, 400);
                // }
                // // Agrega la propiedad password_hash y borra la propiedad password
                data.password_hash = await hashPassword(data.password);
                delete data.password;
            }

            // Se intenta actualizar el usuario...
            const result = await userRepository.updateUser(userId, data);

            // Si no se recibe una respuesta, o la respuesta es un arreglo con 0 en su primer índice
            // (indicando que se han modificado 0 líneas en la base de datos), se lanza un error de que
            // no se ha encontrado el usuario
            if (!result && Array.isArray(result) && result[0] === 0) {
                throw new ServiceError("No se encontró el usuario para actualizar", 404);
            }

            // Para este punto, el usuario debería haber sido actualizado y el usuario
            user = await userRepository.selectUserById(userId);
            delete user.password_hash;

            // Se genera un nuevo token de sesión, con la información actualizada.
            const token = generateToken(user.id, user.username, user.email)

            return {
                "newUser": user, 
                "token": token
            };
        } 
        catch (err) {
            if (err instanceof ServiceError) {
                throw err;
            }
            throw new ServiceError("Error al actualizar el usuario: " + err.message, 500);
        }
    }

    // No debería ser muy complicado, borra el usuario que se le pasa por id y ya.
    async deleteUser(userId) {
        try {
            const deletedCount = await userRepository.deleteUser(userId);
            if (!deletedCount) {
                throw new ServiceError("No se encontró el usuario para eliminar", 404);
            }
            return { message: "Usuario eliminado correctamente", deletedCount };
        } 
        catch (err) {
            if (err instanceof ServiceError) {
                throw err;
            }
            throw new ServiceError("Error al borrar el usuario: " + err.message, 500);
        }
    }

    // Este proceso es parte de la autenticación, pero el error 404 debe ser manejado
    // en el servicio de autenticación para que no se revele que, en efecto, no existe un
    // usuario con ese correo por medidas de seguridad.
    async findUserByEmail(email) {
        try {
            // Primero verifica que el email es válido
            if (!verifyValidEmail(email)) {
                throw new ServiceError("El correo no tiene un formato válido", 400);
            }

            // Si es válido, entonces busca un usuario con ese email
            const user = await userRepository.selectUserByEmail(email);

            // Si el usuario con ese correo no existe, tira un error 404
            if (!user) {
                throw new ServiceError("No ha sido encontrado el usuario con ese correo", 404);
            }

            delete user.password_hash;
            // Por otro lado, devuelve al usuario
            return user;
        } 
        catch (err) {
            // Cualquier otro error es un error interno del servidor, probablemente mala conexión con 
            // la base de datos.
            if (err instanceof ServiceError) {
                throw err;
            }
            throw new ServiceError("Error al buscar el usuario por email: " + err.message, 500);
        }
    }

    // Literalmente la misma función anterior, pero esta vez con la ID del usuario
    async findUserById(id) {
        try {
            const user = await userRepository.selectUserById(id);
            // const plainUser = user.get ? user.get({ plain: true }) : { ...user };

            // Si el usuario con ese correo no existe, tira un error 404
            if (!user) {
                throw new ServiceError("No ha sido encontrado el usuario con ese correo", 404);
            }

            delete user.password_hash;
            // Por otro lado, devuelve al usuario
            return user;
        } 
        catch (err) {
            // Cualquier otro error es un error interno del servidor, probablemente mala conexión con 
            // la base de datos.
            if (err instanceof ServiceError) {
                throw err;
            }
            throw new ServiceError("Error al buscar el usuario por email: " + err.message, 500);
        }
    }

    async getAllUsers() {
        try {
            const users = await userRepository.selectUsers();

            if (!users) {
                throw new ServiceError("No se han encontrado usuarios en la base de datos", 404);
            }

            users.forEach(user => delete user.password_hash);
            return users;
        }
        catch (err) {
            if (err instanceof ServiceError) {
                throw err;
            }
            throw new ServiceError("Error al obtener los usuarios en la base de datos: " + err.message, 500)
        }
    }
}

export const userService = new UserService()