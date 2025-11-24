import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export function generateToken(userId, username, email){
    const payload = {
        "id": userId,
        "username": username,
        "email": email
    }

    // El token expira en 1 hora. El secreto debe estar en una variable de entorno.
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}