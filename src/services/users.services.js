import { UniqueConstraintError, ValidationError } from "sequelize";
import { userRepository } from "../repositories/user.repository.js";
import { hashPassword } from "../utils/users.utils.js";

class ServiceError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class UserService {
    async registerUser(userData) {
        try {
            // Lógica de negocios:
            const data = { ...userData };
            const hashedPassword = await hashPassword(data.password);

            data.password_hash = hashedPassword;
            delete data.password;
            delete data.created_at;
            return await userRepository.createUser(data);
        } 
        catch (err) {
            // Si el correo ya está registrado, tira este error
            if (err instanceof UniqueConstraintError) { 
                throw new ServiceError("[ServiceError] El correo ya está registrado en la base de datos", 409);
            }

            // Si uno de los parámetros requeridos está vacío, devuelve esto
            if (err instanceof ValidationError) {
                const fields = err.errors?.map(e => e.message).join(", ");
                throw new ServiceError("[ServiceError] Campos incompletos: " + fields, 400);
            }
            throw new ServiceError("[ServiceError] Error al crear el usuario: " + err.message, 500);
        }
    }
}

export const userService = new UserService()