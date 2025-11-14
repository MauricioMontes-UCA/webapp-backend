import { DataTypes } from "sequelize";
import { sequelize } from "./db/connection";

// Es un mapeo uno a uno de la tabla de usuarios
const User = sequelize.define(
    'User',
    {
        // Columnas de la tabla
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        last_namme: {
            type: DataTypes.STRING(100),
            allowNull: true,
        }
    },

    {
        // Opciones del modelo
        tableName: 'users',
        timestamps:false
    }
);

export default User;