import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware para verificar el token JWT en la cookie.
 * Extrae el token de la cookie 'authToken', lo verifica y adjunta 
 * los datos del usuario a req.user.
 * 
 * Si el token no existe o es inválido, devuelve un error 401.
 */
export function authenticateToken(req, res, next) {
    try {
        // Obtener el token de la cookie
        const token = req.cookies.authToken;

        if (!token) {
            return res.status(401).json({
                message: "Acceso denegado. No se proporcionó un token de autenticación.",
                code: 401
            });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adjuntar los datos del usuario al request
        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email
        };

        // Continuar con el siguiente middleware o controlador
        next();
    } catch (err) {
        // Token inválido o expirado
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "El token ha expirado. Por favor, inicia sesión nuevamente.",
                code: 401
            });
        }
        
        return res.status(403).json({
            message: "Token inválido.",
            code: 403
        });
    }
}

/**
 * Middleware opcional: verifica el token pero no bloquea la petición si no existe.
 * Útil para rutas que pueden funcionar tanto con usuarios autenticados como no autenticados.
 */
export function optionalAuth(req, res, next) {
    try {
        const token = req.cookies.authToken;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                id: decoded.id,
                username: decoded.username,
                email: decoded.email
            };
        }

        next();
    } catch (err) {
        // Si el token es inválido, simplemente continúa sin autenticación
        next();
    }
}