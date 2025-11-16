import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";
import { ServiceError } from "./service.error.js";

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

            // 4. Si todo es correcto, generar el JWT
            const payload = {
                id: user.id,
                username: user.username,
                email: user.email
            };

            // El token expira en 1 hora. El secreto debe estar en una variable de entorno.
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            // 5. Devolver el token
            return token;
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
