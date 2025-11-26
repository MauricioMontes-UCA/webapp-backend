import { DataTypes } from "sequelize";
import { sequelize } from "../repositories/db/connection";

export const ReadingListBook = sequelize.define(
    "reading_list_book",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        list_id: {
            type: DataTypes.INTEGER,
            allowNull: false
            // references: { model: "reading_list", key: "id" }
        },
        google_book_id: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: 'reading_list_books',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['list_id', 'google_book_id'],
                name: 'UQ_ListBook'
            }
        ]
    }
)