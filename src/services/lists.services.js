import { UniqueConstraintError } from "sequelize";
import { listRepository } from "../repositories/list.repository.js"
import { ServiceError } from "./service.error.js";

class ListService {

    // Servicio a llamar cuando se crea un usuario. El usuario no debería ser
    // capaz de crear más de estos, entonces la única vez en que se llama es para crear
    // las cuatro listas de libro iniciales.
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

    // Al llamar la "librería", me refiero a las cuatro listas que tiene el usuario
    // TODO: Arreglar el llamado para que tenga un formato esperado para el frontend
    async getUserLibrary(userId) {
        const lists = [];

        try {
            for (let i = 1; i <= 4; i++) {
                lists.push(await listRepository.selectCollection(userId, i))
            }

            // No sé como se vé esto, quiero hacer un query antes
            return lists;
        }
        catch (err) {
            throw new ServiceError("Error al obtener las listas de lectura del usuario: " + err.message, 500)
        }
    }

    // Servicio cuando el usuario agrega un libro a una de sus 4 colecciones
    async addBookToList(googleBookId, userId, categoryId) {
        try {
            const list = await listRepository.selectListByUserAndCategory(userId, categoryId);

            if (!list) {
                throw new ServiceError("Lista de libros no encontrada", 500)
            }

            const bookData = {
                list_id: list.id,
                google_book_id: googleBookId
            }

            const newBook = await listRepository.addBook(bookData);

            return newBook;
        }
        catch (err) {
            if (err instanceof ServiceError) {
                throw err;
            }

            if (err instanceof UniqueConstraintError) {
                throw new ServiceError("El libro ya se encuentra en la lista", 409)
            }

            throw new ServiceError("Error al intentar agregar un libro a la lista: " + err.message, 500)
        }
    }

    // Servicio cuando el usuario mueve un libro de una colección a la otra
    async moveBookToList(bookId, userId, categoryId) {
        try {
            let book = await listRepository.getBookById(bookId)
            console.log("ID de la lista antes del cambio: " + book.list_id)

            if (!book) {
                // Este es 500 porque, en el contexto, el request del usuario dependa de que
                // el libro exista para empezar
                throw new ServiceError("Libro no encontrado", 500); 
            }

            const list = await listRepository.selectListByUserAndCategory(userId, categoryId)

            const result = await listRepository.updateBook(bookId, {
                user_id: book.user_id,
                list_id: list.id,
            })

            if (!result && Array.isArray(result) && result[0] === 0) {
                throw new ServiceError("Libro no encontrado al actualizar", 500);
            }

            book = await listRepository.getBookById(bookId);
            console.log("ID de la lista después del cambio: " + book.list_id)

            return book;
        }
        catch (err) {
            if (err instanceof ServiceError) {
                throw err;
            }

            if (err instanceof UniqueConstraintError) {
                throw new ServiceError("El libro ya se encuentra en la lista", 409)
            }

            throw new ServiceError("Error al actualizar información del libro: " + err.message, 500);
        }
    }

    // Servicio para quitar un libro de una colección.
    async removeBook(bookId) {
        try {
            const book = await listRepository.getBookById(bookId)
            if (!book) {
                throw new ServiceError("No se encontró el libro para borrar", 404);
            }

            await listRepository.removeBook(bookId);
            return { message: "Libro removido de la lista de lectura exitosamente" }
        }
        catch (err) {
            if (err instanceof ServiceError) {
                throw err;
            }
            
            throw new ServiceError("Error al quitar el libro de la lista: " + err.message, 500)
        }
    }
}

export const listService = new ListService()