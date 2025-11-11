import { booksService } from "../services/books.services.js";

class BooksController {
    static cache = new Map();
    
    static async getCachedBooks(query) {
        const tenMinutesInMiliseconds = 10 * 60 * 1000;
        let books = [];

        if (this.cache.has(query)) return this.cache.get(query);

        if (query === 'recent') {
            books = await booksService.getRecentBooks();
        }
        else {
            books = await booksService.getBooksByQuery(query);
        }
        this.cache.set(query, books)

        setTimeout(() => this.cache.delete(query), tenMinutesInMiliseconds);

        return books;
    }
    
    async searchBookInfo(req, res) {

        const bookId = req.params.id;

        try {
            // Se obtiene la info que me importa del libro
            const bookData = await booksService.getBookById(bookId)

            console.info("Información obtenida de la API exitosamente.")

            res.status(200).json(bookData);


            // TODO: Llamar al servicio de reseñas para obtener:

            // La reseña del usuario
            // La calificación del usuario
            // El promedio de la clasificación del libro
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
    //      keywords: "keywords"
    //      title: "keywords",
    //      author: "keywords",
    //      publisher: "keywords",
    //      subject: "keywords",
    //      isbn: "isbn-code"
    // }
    async searchBooksAdvanced(req, res) {
        try {
            // TODO: En el frontend, validar que no se pueda hacer una búsqueda vacía

            const params = req.body;
            const queryParams = [];

            if (Object.keys(params).length === 0) {
                res.status(400).json({ error: "No hay parámetros ingresados para la búsqueda. "})
                return;
            }

            if (params.keywords) queryParams.push(params.keywords);
            if (params.title) queryParams.push(`intitle:${params.title}`);
            if (params.author) queryParams.push(`inauthor:${params.author}`);
            if (params.publisher) queryParams.push(`inauthor:${params.publisher}`);
            if (params.subject) queryParams.push(`subject:${params.subject}`);
            if (params.isbn) queryParams.push(`isbn:${params.isbn}`);

            const query = queryParams.join("+");

            // Solo por si acaso, clarifico que books es una lista de libros
            const bookList = await booksService.getBooksByQuery(query);

            res.status(200).json({ items: bookList })
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

    async searchBooks(req, res) {
        const query = req.params.query;

        try {
            if (!query) {
                res.status(400).json({ error: "No se ha ingresado un query para la búsqueda. "})
            }

            const bookList = await booksService.getBooksByQuery(query); 

            res.status(200).json({ items: bookList });
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

    async getBooks(req, res) {
        const subjects = ['recent', 'bestseller', 'fiction', 'mystery', 'romance', 'science', 'history'];

        try {
            const results = await Promise.allSettled (
                subjects.map (query => 
                    BooksController.getCachedBooks(query).then(books => ({ 
                        subject: query,
                        items: books
                    }))
                )
            );
    
            const lists = results
                .filter (r => r.status === "fulfilled")
                .map(r => r.value)
    
            res.status(200).json({ lists });
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
}

export const booksController = new BooksController();