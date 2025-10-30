import BooksService from "../services/books.service.js";

export default class BooksController {
    static async searchBookById(req, res) {

        const bookId = req.params.id;

        try {
            const bookData = await BooksService.getBookById(bookId)

            console.info("Información obtenida de la API exitosamente.")

            res.status(200).json(bookData);
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

    // static async searchBooks(req, res) {
    //     try {
    //         if (Object.keys(req.query).length === 0) {
    //             res.status(400).json({ error: "No hay parámetros ingresados para la búsqueda."})
    //         }

    //         const { id, title } = req.query;

    //     }
    //     catch(err) {

    //     }   
    // }
}