import { ReadingListBook } from "../models/listBook.model.js";
import { ReadingList } from "../models/readingList.model.js";

class ListRepository {

    // Crea una lista de lectura. Es estática, llamar 4 veces
    // para crear cuatro listas de libros por usuario, nunca más después
    async createList(data) {
        const list = await ReadingList.create(data)
        return list ? list.get({ plain: true }) : null;
    };

    // Esto debería ser todo por parte de las listas. La única instancia
    // en que estas son borradas es cuando se borra un usuario. Esto es manejado
    // con una asociación en associations.js

    async selectListByUserAndCategory(userId, categoryId) {
        const list = await ReadingList.findOne({ where: {
            user_id: userId,
            id_category: categoryId
        }})
        return list ? list.get({ plain: true }) : null;
    }

    async addBook(data) {
        const book = await ReadingListBook.create(data);
        return book ? book.get({ plain: true }) : null;
    }

    async getBookById(id) {
        const book = await ReadingListBook.findOne({ where: {id} })
        return book ? book.get({ plain: true }) : null;
    }

    async updateBook(id, newData) {
        const databaseResponse = await ReadingListBook.update(newData, { where: {id} });
        return databaseResponse;
    }

    async removeBook(id) {
        const databaseResponse = await ReadingListBook.destroy({ where: {id} })
        return databaseResponse;
    }
    
    async selectReadingList(userId, categoryId) {
        const readingList = await findAll({
            where: {
                user_id: userId,
                id_category: categoryId
            },
            include: [{
                ReadingListBook
            }],
            order: [[ ReadingListBook, 'google_book_id']]
        })
        return readingList;
    }
}

export const listRepository = new ListRepository();