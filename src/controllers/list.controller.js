import { readingListService } from "../services/list.services.js";

class ReadingListController {
  /**
   * GET /lists/user/me
   * Obtiene todas las listas del usuario autenticado
   */
  async getListsByUser(req, res) {
    try {
      const userId = req.user.id;
      const lists = await readingListService.getListsByUser(userId);

      res.status(200).json({
        message: "Listas obtenidas exitosamente",
        data: lists
      });
    } catch (error) {
      console.error("Error en getListsByUser:", error.message);
      const status = error.status || 500;
      res.status(status).json({
        message: error.message || "Error interno del servidor",
        details: error.details || null
      });
    }
  }

  /**
   * GET /lists/:listId/books
   * Obtiene todos los libros de una lista
   */
  async getBooksInList(req, res) {
    try {
      const { listId } = req.params;
      const formattedBooks = await readingListService.getBooksInList(listId);

      res.status(200).json({
        message: "Libros de la lista obtenidos exitosamente",
        data: formattedBooks
      });
    } catch (error) {
      console.error("Error en getBooksInList:", error.message);
      const status = error.status || 500;
      res.status(status).json({
        message: error.message || "Error interno del servidor",
        details: error.details || null
      });
    }
  }

  /**
   * POST /lists/:listId/books
   * Agrega un libro a la lista
   * Body: { bookId, cover?, title?, author?, pages?, progress? }
   */
  async addBookToList(req, res) {
    try {
      const { listId } = req.params;
      const { bookId, cover, title, author, pages, progress } = req.body;

      const book = await readingListService.addBookToList(listId, {
        bookId,
        cover,
        title,
        author,
        pages,
        progress
      });

      res.status(201).json({
        message: "Libro agregado a la lista exitosamente",
        data: book
      });
    } catch (error) {
      console.error("Error en addBookToList:", error.message);
      const status = error.status || 500;
      res.status(status).json({
        message: error.message || "Error interno del servidor",
        details: error.details || null
      });
    }
  }

  /**
   * DELETE /lists/:listId/books
   * Elimina un libro de la lista
   * Body: { bookId }
   */
  async removeBookFromList(req, res) {
    try {
      const { listId } = req.params;
      const { bookId } = req.body;

      await readingListService.removeBookFromList(listId, bookId);

      res.status(200).json({
        message: "Libro eliminado de la lista exitosamente"
      });
    } catch (error) {
      console.error("Error en removeBookFromList:", error.message);
      const status = error.status || 500;
      res.status(status).json({
        message: error.message || "Error interno del servidor",
        details: error.details || null
      });
    }
  }
}

export const readingListController = new ReadingListController();
