import { readingListRepository } from "../repositories/list.repository.js";

class LibraryService {
  /**
   * Mapea categorías de frontend a nombres reales en la DB
   * @param {string} tab - Nombre de categoría del frontend
   * @returns {string} Nombre de categoría en la DB
   */
  mapCategory(tab) {
    switch (tab) {
      case 'reading': return 'leyendo';
      case 'toRead': return 'por leer';
      case 'completed': return 'terminado';
      case 'favorites': return 'favoritos';
      default: return '';
    }
  }

  /**
   * Obtiene las estadísticas de libros por categoría de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Estadísticas con conteos por categoría
   */
  async getStats(userId) {
    try {
      const lists = await readingListRepository.getListsByUser(userId);

      // Contar libros por categoría
      const stats = {
        reading: 0,
        toRead: 0,
        completed: 0,
        favorites: 0
      };

      lists.forEach(list => {
        const categoryName = list.ReadingListCategory?.category?.toLowerCase() || '';
        const count = list.ReadingListBooks?.length || 0;

        if (categoryName === 'leyendo') stats.reading += count;
        else if (categoryName === 'por leer') stats.toRead += count;
        else if (categoryName === 'terminado') stats.completed += count;
        else if (categoryName === 'favoritos') stats.favorites += count;
      });

      return stats;
    } catch (error) {
      throw {
        status: error.status || 500,
        message: error.message || "Error al obtener las estadísticas",
        details: error.details || null
      };
    }
  }

  /**
   * Obtiene los libros de una categoría específica de un usuario
   * @param {number} userId - ID del usuario
   * @param {string} category - Categoría a consultar
   * @returns {Promise<Array>} Array de libros formateados
   */
  async getBooksByCategory(userId, category) {
    try {
      // Obtener todas las listas del usuario
      const lists = await readingListRepository.getListsByUser(userId);
      const mappedCategory = this.mapCategory(category);
      
      const targetList = lists.find(
        list => (list.ReadingListCategory?.category?.toLowerCase() || '') === mappedCategory
      );

      // Si no hay lista para esa categoría, retornar array vacío
      if (!targetList) return [];

      const books = await readingListRepository.getBooksInList(targetList.id);

      // Mapear y formatear los datos para el frontend
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
        message: error.message || "Error al obtener los libros de la categoría",
        details: error.details || null
      };
    }
  }
}

export const libraryService = new LibraryService();
