import { DataTypes } from "sequelize";
import { sequelize } from "../repositories/db/connection.js";

export const List = sequelize.define(
    "reading_list",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        // Este de aquí referencia otra tabla catálogo, pero no voy a hacer
        // un modelo para eso. Así que:
        // id          category  
        // ----------  ----------
        // 1           READING   
        // 2           DONE      
        // 3           TO_START  
        // 4           FAVORITES 

        id_category: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },

    {
        tableName: 'reading_lists',
        timestamps: false
    }
)

export const Book = sequelize.define(
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

Book.belongsTo(List, {
    foreignKey: 'list_id',
    onDelete: 'CASCADE'
})

List.hasMany(Book, {
    foreignKey: "list_id"
})