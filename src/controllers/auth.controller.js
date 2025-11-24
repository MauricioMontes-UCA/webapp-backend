import { authService } from "../services/auth.services.js";

class AuthController {

    // se trabaja con un POST, el cuerpo es el siemplemente el correo y la contraseña
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
    
            const { user, token } = await authService.verifyCredentials(email, password);
            
            // Se establece el token en una cookie HttpOnly por seguridad
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: false, // debería ser true, pero creo que esto solo funciona con HTTPS
                sameSite: 'strict',
                maxAge: 3600 * 1000 // 1 hora
            });

            res.status(200).json(user);
        } 
        catch (err) {
            console.error("Error en el controlador de autenticación", err.message);

            const status = err.status || 500;

            res.status(status).json({
                message: err.message || "Error interno del servidor",
                code: status
            });       
        }
    }

    // Cierra la sesión del usuario eliminando la cookie de autenticación
    async logoutUser(req, res) {
        try {
            // Limpiar la cookie de autenticación
            res.clearCookie('authToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'strict'
            });

            res.status(200).json({
                message: "Sesión cerrada exitosamente"
            });
        } catch (err) {
            console.error("Error al cerrar sesión", err.message);
            res.status(500).json({
                message: "Error al cerrar sesión",
                code: 500
            });
        }
    }
}

export const authController = new AuthController();