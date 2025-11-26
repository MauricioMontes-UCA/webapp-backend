import { listService } from "../services/lists.services.js";

class ListController {
    // Se espera un POST
    async addBookToList (req, res) {
        try {
            // Se usará req.user.id gracias al middleware de auth
            const userId = req.user.id;
            const { googleBookId, categoryId } = req.body;

            const book = await listService.addBookToList(googleBookId, userId, categoryId);

            return res.status(201).json(book);
        } 
        catch (err) {
            console.error("Error: " + err.message);

            const status = err.status || 500;
            res.status(status).json({
                message: err.message || "Error interno del servidor",
                code: status
            })
        }
    }

    // Se espera un PUT
    async moveBookToList(req, res) {
        try {
            const userId = req.user.id
            const { bookId, categoryId } = req.body;

            const book =  await listService.moveBookToList(bookId, userId, categoryId);

            return res.status(200).json({
                message: "Libro cambiado de lista exitosamente",
                book
            })
        } 
        catch (err) {
            console.error("Error: " + err.message);
            
            const status = err.status || 500;
            res.status(status).json({
                message: err.message || "Error interno del servidor",
                code: status
            })
        }
    }
    
    // Se espera un DELETE con un param :id
    async removeBookFromList(req, res) {
        try {
            const bookId = req.params.id;
            const result = await listService.removeBook(bookId);

            console.info("Libro eliminado de la lista exitosamente");
            return res.status(200).json(result);
        }
        catch (err) {
            console.error("Error: " + err.message);
            const status = err.status || 500;
            res.status(status).json({
                code: status,
                message: err.message || "Error interno del servidor"
            })
        }
    }

    async getUserLibrary(req, res) {
        try {
            const userId = req.user.id;
            const lists = await listService.getUserLibrary(userId);

            console.info("Colecciones de listas obtenidas exitosamente");
            return res.status(200).json(lists);
        }
        catch (err) {
            console.error("Error: " + err.message);
            const status = err.status || 500;
            res.status(status).json({
                code: status,
                message: err.message || "Error interno del servidor"
            })
        }   
    }
}

export const listController = new ListController();