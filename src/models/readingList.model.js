import { DataTypes } from "sequelize";
import { sequelize } from "../repositories/db/connection";

export const ReadingList = sequelize.define(
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
            
            //references: { model: "user", key: "id" }
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