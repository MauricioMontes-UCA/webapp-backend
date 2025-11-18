import { readingListRepository } from "../repositories/list.repository.js";

class LibraryController {
  // Devuelve las estadísticas de un usuario
  async getStats(req, res) {
    const userId = req.params.userId;

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

      res.json(stats);
    } catch (error) {
      console.error("Error en getStats:", error.message);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async getBooksByCategory(req, res) {
    const { userId, category } = req.params;

    try {
      // Obtener todas las listas del usuario
      const lists = await readingListRepository.getListsByUser(userId);
      const targetList = lists.find(
        list => (list.ReadingListCategory?.category?.toLowerCase() || '') === mapCategory(category)
      );

      if (!targetList) return res.json([]); //si no hay libros

      const books = await readingListRepository.getBooksInList(targetList.id);

      // Mapear para el frontend
      const formattedBooks = books.map((book, index) => ({
        id: book.id,
        cover: book.cover || "https://via.placeholder.com/120x180",
        title: book.title || `Libro de ejemplo ${index + 1}`,
        author: book.author || "Autor desconocido",
        pages: book.pages || 100,
        progress: book.progress || 0
      }));

      res.json(formattedBooks);
    } catch (error) {
      console.error("Error en getBooksByCategory:", error.message);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

// Mapear categorías de frontend a nombres reales en la DB
const mapCategory = (tab) => {
  switch (tab) {
    case 'reading': return 'leyendo';
    case 'toRead': return 'por leer';
    case 'completed': return 'terminado';
    case 'favorites': return 'favoritos';
    default: return '';
  }
};

export const libraryController = new LibraryController();
