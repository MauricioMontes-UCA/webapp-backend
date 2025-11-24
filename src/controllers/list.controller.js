import { readingListRepository } from "../repositories/list.repository.js";

class ReadingListController {
  /**
   * GET /lists/user/:userId
   * Obtiene todas las listas de un usuario
   */
  async getListsByUser(req, res) {
    try {
      const { userId } = req.params;
      const lists = await readingListRepository.getListsByUser(userId);

      res.status(200).json({
        message: "Listas obtenidas exitosamente",
        data: lists
      });
    } catch (error) {
      console.error("Error en getListsByUser:", error.message);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  /**
   * GET /lists/:listId/books
   * Obtiene todos los libros de una lista
   * 
   * transformación de datos para que el frontend reciba
   *  exactamente lo que espera: { id, cover, title, author, pages, progress }
   */

  async getBooksInList(req, res) {
    try {
      const { listId } = req.params;
      const books = await readingListRepository.getBooksInList(listId);

      // Añadido: mapear los datos de la DB a lo que espera el frontend
      const formattedBooks = books.map((book, index) => ({
        id: book.id,
        cover: book.cover || "https://via.placeholder.com/120x180", 
        title: book.title || `Libro de ejemplo ${index + 1}`,
        author: book.author || "Autor desconocido",
        pages: book.pages || 100,
        progress: book.progress || 0
      }));

      res.status(200).json({
        message: "Libros de la lista obtenidos exitosamente",
        data: formattedBooks
      });
    } catch (error) {
      console.error("Error en getBooksInList:", error.message);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  /**
   * POST /lists/:listId/books
   * Agrega un libro a la lista
   * Body: { bookId }
   */
  async addBookToList(req, res) {
    try {
      const { listId } = req.params;
      // Recibir todo lo que el frontend manda
      const { bookId, cover, title, author, pages, progress } = req.body;
      // Pasar todos los datos al repositorio
      const book = await readingListRepository.addBookToList(listId, {
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
      res.status(500).json({ message: "Error interno del servidor" });
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

      await readingListRepository.removeBookFromList(listId, bookId);

      res.status(200).json({
        message: "Libro eliminado de la lista exitosamente"
      });
    } catch (error) {
      console.error("Error en removeBookFromList:", error.message);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

}

export const readingListController = new ReadingListController();
