import { ReadingListBook } from "./listBook.model";
import { ReadingList } from "./readingList.model.js";
import { User } from "./user.model.js";

ReadingList.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

ReadingListBook.belongsTo(ReadingList, {
    foreignKey: 'list_id',
    onDelete: 'CASCADE'
})