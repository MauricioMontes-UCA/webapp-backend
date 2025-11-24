import axios from "axios";
import dotenv from "dotenv"
import { filterBookInfo } from "../utils/books.utils.js";

dotenv.config()
const API_KEY = process.env.API_KEY

class ErrorAPI extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class BooksService {
    async getBookById(id) {
        try {
            // Intenta contactarse con la API de google
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`,
            );

            // Filtra la información
            return filterBookInfo(response.data);
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

    // Dados los parámetros, el resultado será una lista de 40 libros, cada libro con los datos
    // que se encuentran en books.utils.js.
    // Son 20 libros porque la idea es que este servicio es para búsqueda, tanto sencilla como avanzada.

    // IMPORTANTE: Al parecer, si la búsqueda es demasiado sencilla, a google le importa un comino maxResults y siempre
    // devolverá 10 objetos.

    async getBooksByQuery(query) {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=20`
            )

            // A cada item del resultado, a cada libro, se le filtra la información
            const books = response.data.items.map((book) => filterBookInfo(book))
            return books;
        }
        catch (err) {
            if (err.response) {
                const status = err.response.status;
                const axiosErrorMessage = err.response.data?.error?.message || "Error desconocido de la API";
    
                if (status === 404) {
                    throw new ErrorAPI(`No se encontraron libros`, status);
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

    // Obtiene los 10 best sellers más recientes
    async getRecentBooks( ) {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=bestseller&orderBy=newest&key=${API_KEY}&maxResults=10`
            )

            const books = response.data.items.map((book) => filterBookInfo(book))
            return books;
        } 
        catch (err) {
            if (err.response) {
                const status = err.response.status;
                const axiosErrorMessage = err.response.data?.error?.message || "Error desconocido de la API";

                if (status === 404) {
                    throw new ErrorAPI(errorMessage, status);
                }

                const errorMessage = `Error de la API de Google Books. \nCódigo: ${status}.\nMensaje: ${axiosErrorMessage}`;
                throw new ErrorAPI(errorMessage, status);
            }
            else if (err.request) {
                throw new ErrorAPI("No se recibió respuesta de la API, pruebe la conexión", 503);
            }
            else {
                console.error("Error en la configuración de la solicitud", err.message);
                throw new ErrorAPI("Error interno al preparar la solicitud", 500);
            }
        }
    }
}

export const booksService = new BooksService();