import { libraryService } from "../services/library.services.js";

class LibraryController {
  /**
   * GET /library/stats
   * Devuelve las estadísticas de libros por categoría del usuario autenticado
   */
  async getStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await libraryService.getStats(userId);

      res.status(200).json({
        message: "Estadísticas obtenidas exitosamente",
        data: stats
      });
    } catch (error) {
      console.error("Error en getStats:", error.message);
      const status = error.status || 500;
      res.status(status).json({
        message: error.message || "Error interno del servidor",
        details: error.details || null
      });
    }
  }

  /**
   * GET /library/:category
   * Obtiene los libros de una categoría específica del usuario autenticado
   * @param {string} category - Categoría: reading, toRead, completed, favorites
   */
  async getBooksByCategory(req, res) {
    try {
      const userId = req.user.id;
      const { category } = req.params;

      const formattedBooks = await libraryService.getBooksByCategory(userId, category);

      res.status(200).json({
        message: "Libros obtenidos exitosamente",
        data: formattedBooks
      });
    } catch (error) {
      console.error("Error en getBooksByCategory:", error.message);
      const status = error.status || 500;
      res.status(status).json({
        message: error.message || "Error interno del servidor",
        details: error.details || null
      });
    }
  }
}

export const libraryController = new LibraryController();
