import { booksService } from "../services/books.services.js";

class BooksController {
    async searchBookById(req, res) {

        const bookId = req.params.id;

        try {
            const bookData = await booksService.getBookById(bookId)

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

    // es un método post para que el request tenga un body, que es un objeto.
    // el objeto tiene que tener la forma:
    // {
    //      title: "keywords",
    //      author: "keywords",
    //      publisher: "keywords",
    //      subject: "keywords"
    // }
    async searchBooksAdvanced(req, res) {
        try {
            // TODO: En el frontend, validar que no se pueda hacer una búsqueda vacía

            const params = req.body;
            const queryParams = [];

            if (params.title) queryParams.push(`intitle:${params.title}`)

            if (Object.keys(req.query).length === 0) {
                res.status(400).json({ error: "No hay parámetros ingresados para la búsqueda. "})
            }



        }
        catch (err) {

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

export const booksController = new BooksController();