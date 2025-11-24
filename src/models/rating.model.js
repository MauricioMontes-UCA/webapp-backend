import { DataTypes } from "sequelize";
import { sequelize } from "../repositories/db/connection.js";

// Modelo para la tabla de calificaciones (book_reviews)
const Rating = sequelize.define(
    'BookReview',
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
            references: {
                model: 'users',
                key: 'id'
            }
        },
        google_book_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'ID del libro de Google Books API'
        },
        rating: {
            type: DataTypes.DECIMAL,
            allowNull: true,
            validate: {
                min: 1,
                max: 5
            }
        },
        review: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Comentario o reseña del usuario'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'book_reviews',
        timestamps: false
    }
);

export default Rating;
