import { DataTypes } from "sequelize";
import { sequelize } from "../repositories/db/connection.js";

export const ReadingList = sequelize.define(
  "ReadingList",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id" // mapea a user_id en la DB
    },
    categoryId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_category",
      references: { model: "reading_list_categories", key: "id" }
    }
  },
  { tableName: "reading_lists", timestamps: false }
);

export const ReadingListBook = sequelize.define(
  "ReadingListBook",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    listId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "list_id",
      references: { model: "reading_lists", key: "id" }
    },
    bookId: { 
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "google_book_id"
    },
    // Añadido para frontend – propiedades que espera
    cover: { type: DataTypes.STRING, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: true },
    author: { type: DataTypes.STRING, allowNull: true },
    pages: { type: DataTypes.INTEGER, allowNull: true },
    progress: { type: DataTypes.INTEGER, allowNull: true }
  },
  { tableName: "reading_list_books", timestamps: false }
);

export const ReadingListCategory = sequelize.define(
  "ReadingListCategory",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category: { type: DataTypes.STRING(50), allowNull: false }
  },
  { tableName: "reading_list_categories", timestamps: false }
);
