import {
  ReadingList,
  ReadingListBook,
  ReadingListCategory,
} from "../models/list.model.js";

class ReadingListRepository {
  async getListsByUser(userId) {
    return await ReadingList.findAll({
      where: { userId },
      include: [{ model: ReadingListCategory, attributes: ["category"] }],
    });
  }

  async getBooksInList(listId) {
    //devolver propiedades que espera el frontend
    return await ReadingListBook.findAll({
      where: { listId },
      attributes: ["id", "cover", "title", "author", "pages", "progress"],
    });
  }

  async addBookToList(listId, data) {
    return await ReadingListBook.create({
      listId,
      bookId: data.bookId,
      cover: data.cover,
      title: data.title,
      author: data.author,
      pages: data.pages,
      progress: data.progress ?? 0,
    });
  }

  async removeBookFromList(listId, bookId) {
    return await ReadingListBook.destroy({
       where: { listId, bookId } });
  }
}

export const readingListRepository = new ReadingListRepository();
