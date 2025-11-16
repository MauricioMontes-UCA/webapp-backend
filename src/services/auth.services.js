import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";
import { ServiceError } from "./service.error.js";
import { generateToken } from "../utils/auth.utils.js";

dotenv.config()

class AuthService {
    async verifyCredentials(email, password) {
        try {
            // 1. Validar que se recibieron ambos campos
            if (!email || !password) {
                throw new ServiceError("El email y la contraseña son requeridos", 400);
            }

            // 2. Buscar al usuario por email
            const user = await userRepository.selectUserByEmail(email);
            if (!user) {
                throw new ServiceError("Credenciales inválidas", 401); // 401 Unauthorized
            }
            
            // 3. Comparar la contraseña con el hash almacenado
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                throw new ServiceError("Credenciales inválidas", 401); // 401 Unauthorized
            }
            
            // 4. Si todo es correcto, generar el JWT y borrar información del usuario no necesaria
            const token = generateToken(user.id, user.username, user.email);
            delete user.password_hash;
            
            // 5. Devolver el token
            return {
                "user": user,
                "token": token
            };
        } 
        catch (err) {
            // Si ya es un ServiceError, relanzarlo para que el controlador lo atrape
            if (err instanceof ServiceError) {
                throw err;
            }
            // Para cualquier otro tipo de error
            throw new ServiceError("Error en el servidor durante el login: " + err.message, 500);
        }
    }
}

export const authService = new AuthService();
