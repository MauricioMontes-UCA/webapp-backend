import { readingListRepository } from "../repositories/list.repository.js";

class ReadingListService {
  /**
   * Obtiene todas las listas de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Lista de listas del usuario
   */
  async getListsByUser(userId) {
    try {
      const lists = await readingListRepository.getListsByUser(userId);
      return lists;
    } catch (error) {
      throw {
        status: error.status || 500,
        message: error.message || "Error al obtener las listas del usuario",
        details: error.details || null
      };
    }
  }

  /**
   * Obtiene todos los libros de una lista con formato estandarizado
   * @param {number} listId - ID de la lista
   * @returns {Promise<Array>} Array de libros formateados
   */
  async getBooksInList(listId) {
    try {
      const books = await readingListRepository.getBooksInList(listId);

      // Transformar datos de la DB al formato esperado por el frontend
      const formattedBooks = books.map((book, index) => ({
        id: book.id,
        cover: book.cover || "https://via.placeholder.com/120x180",
        title: book.title || `Libro de ejemplo ${index + 1}`,
        author: book.author || "Autor desconocido",
        pages: book.pages || 100,
        progress: book.progress || 0
      }));

      return formattedBooks;
    } catch (error) {
      throw {
        status: error.status || 500,
        message: error.message || "Error al obtener los libros de la lista",
        details: error.details || null
      };
    }
  }

  /**
   * Agrega un libro a una lista
   * @param {number} listId - ID de la lista
   * @param {Object} bookData - Datos del libro { bookId, cover, title, author, pages, progress }
   * @returns {Promise<Object>} Libro agregado
   */
  async addBookToList(listId, bookData) {
    try {
      // Validar que los datos requeridos estén presentes
      if (!bookData.bookId) {
        throw {
          status: 400,
          message: "El ID del libro es requerido",
          details: null
        };
      }

      const book = await readingListRepository.addBookToList(listId, bookData);
      return book;
    } catch (error) {
      throw {
        status: error.status || 500,
        message: error.message || "Error al agregar el libro a la lista",
        details: error.details || null
      };
    }
  }

  /**
   * Elimina un libro de una lista
   * @param {number} listId - ID de la lista
   * @param {number} bookId - ID del libro a eliminar
   * @returns {Promise<void>}
   */
  async removeBookFromList(listId, bookId) {
    try {
      // Validar que los datos requeridos estén presentes
      if (!bookId) {
        throw {
          status: 400,
          message: "El ID del libro es requerido",
          details: null
        };
      }

      await readingListRepository.removeBookFromList(listId, bookId);
    } catch (error) {
      throw {
        status: error.status || 500,
        message: error.message || "Error al eliminar el libro de la lista",
        details: error.details || null
      };
    }
  }
}

export const readingListService = new ReadingListService();
