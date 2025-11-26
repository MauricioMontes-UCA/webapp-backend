import { List, Book } from "../models/list.model.js";

class ListRepository {

    // Crea una lista de lectura. Es estática, llamar 4 veces
    // para crear cuatro listas de libros por usuario, nunca más después
    async createList(data) {
        const list = await List.create(data)
        return list ? list.get({ plain: true }) : null;
    };

    // Esto debería ser todo por parte de las listas. La única instancia
    // en que estas son borradas es cuando se borra un usuario. Esto es manejado
    // con una asociación en associations.js

    async selectListByUserAndCategory(userId, categoryId) {
        const list = await List.findOne({ where: {
            user_id: userId,
            id_category: categoryId
        }})
        return list ? list.get({ plain: true }) : null;
    }

    async addBook(data) {
        const book = await Book.create(data);
        return book ? book.get({ plain: true }) : null;
    }

    async getBookById(id) {
        const book = await Book.findOne({ where: {id} })
        return book ? book.get({ plain: true }) : null;
    }

    async updateBook(id, newData) {
        const databaseResponse = await Book.update(newData, { where: {id} });
        return databaseResponse;
    }

    async removeBook(id) {
        const databaseResponse = await Book.destroy({ where: {id} })
        return databaseResponse;
    }
    

    // No sé como es el objeto respuesta para este caso, pero es el equivalente a
    // un JOIN de las listas de lectura con los libros de las listas de lectura

    async selectCollection(userId, categoryId) {
        const list = await List.findAll({
            where: {
                user_id: userId,
                id_category: categoryId
            },
            include: [ Book ],
            order: [[ Book, 'google_book_id']]
        })
        return list;
    }
}

export const listRepository = new ListRepository();