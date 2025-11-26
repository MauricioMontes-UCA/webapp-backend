import { listRepository } from "../repositories/readingList.repository"
import { ServiceError } from "./service.error";

class ReadingListService {
    async createUserLibrary(userId) {
        const listData = {
            user_id: userId,
        }

        try {
            // Se crean la listas READING, TO_START, DONE, FAVORITES
            for (let i = 1; i <= 4; i++) {
                listData.id_category = i;
                await listRepository.createList(listData);
                console.info("Lista creada existosamente")
            }

            return {
                message: "Listas de libros asignadas al usuario"
            }
        }
        catch (err) {
            throw new ServiceError("Error al crear las listas de libros para el usuario: " + err.message, 500)
        }
    }

    async getUserLibrary(userId) {
        const lists = [];

        try {
            for (let i = 1; i <= 4; i++) {
                lists.push(await listRepository.selectReadingList(userId, i))
            }

            // No sé como se vé esto, quiero hacer un query antes
            return lists;
        }
        catch (err) {
            throw new ServiceError("Error al obtener las listas de lectura del usuario: " + err.message, 500)
        }
    }

    async addBookToList(googleBookId, userId, categoryId) {
        try {
            const list = await listRepository.selectListByUserAndCategory(userId, categoryId);

            if (!list) {
                throw new ServiceError("Lista de libros no encontrada", 500)
            }

            const bookData = {
                list_id: list.id,
                google_book_id: bookId
            }

            const newBook = await listRepository.addBook(bookData);

            return newBook;
        }
        catch (err) {
            if (err instanceof ServiceError) {
                throw err;
            }

            throw new ServiceError("Error al intentar agregar un libro a la lista: " + err.message, 500)
        }
    }

    async moveBookToList(bookId, categoryId) {
        try {
            const bookId = await listRepository.getBookById(bookId)

            if (!bookId) {
                // Este es 500 porque, en el contexto, el request del usuario dependa de que
                // el libro exista para empezar
                throw new ServiceError("Libro no encontrado", 500); 
            }

            const result = await listRepository.updateBook({
                id_category: categoryId,
            })

            if (!result && Array.isArray(result) && result[0] === 0) {
                throw new ServiceError("Libro no encontrado al actualizar", 500);
            }

            return result;
        }
        catch (err) {
            if (err instanceof ServiceError) {
                throw err;
            }
            throw new ServiceError("Error al actualizar información del libro: " + err.message, 500);
        }
    }

    async removeBook(bookId) {
        try {
            const deletedCount = await listRepository.removeBook(bookId);
            if (!deletedCount) {
                throw new ServiceError("No se encontró el libro para borrar", 500);
            }
            return { message: "Libro removido de la lista de lectura exitosamente" }
        }
        catch {
            if (err instanceof ServiceError) {
                throw err;
            }
            throw new ServiceError("Error al quitar el libro de la lista: " + err.message, 500)
        }
    }
}

export const listService = new ReadingListService()