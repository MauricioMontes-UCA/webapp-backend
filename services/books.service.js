import axios from "axios";
import dotenv from "dotenv"

dotenv.config()
const API_KEY = process.env.API_KEY

class ErrorAPI extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

export default class BooksService {
    static async getBookById(id) {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${id}&key=${API_KEY}`
            );

            return response.data.items[0];
        } 
        catch (err) {
            // Hay un error al llamar a la API...
            if (err.response) {
                const status = err.response.status;
                const axiosErrorMessage = err.response.data?.error?.message || "Error desconocido de la API";
    
                // Si no se encontró el libro, pues problema del usuario
                if (status === 404) {
                    throw new ErrorAPI(`Libro no encontrado con el ID ${id}`, status);
                }

                // Es problema de la API de Google Books, y en este caso, nuestra también para el usuario
                const errorMessage = `Error de la API de Google Books.\nCódigo: ${status}.\nMensaje: ${axiosErrorMessage}`;
                throw new ErrorAPI(errorMessage, status);
            }
            else if (err.request) {
                throw new ErrorAPI('No se recibió respuesta de la API, pruebe la conexión', 503);
            }
            else {
                console.error("Error en la configuración de la solicitud", err.message)
                throw new ErrorAPI("Error interno al preparar la solicitud", 500)
            }
        }
    }
}
