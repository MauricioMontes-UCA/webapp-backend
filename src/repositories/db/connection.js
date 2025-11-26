import dotenv from "dotenv"
import { Sequelize } from "sequelize";

dotenv.config()

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_SERVER,
        dialect: "mssql",
        dialectOptions: {
            options: {
                encrypt: true,
                trustServerCertificate: true
            }
        },
        logging: false,
    }
);

export async function getConnection() {
    try {
        await sequelize.authenticate();
        console.log("Conexión exitosa con la base de datos.");
        await sequelize.sync()
        return sequelize;
    }
    catch (err) {
        console.error("Conexión a la base de datos ha fallado");
        throw err;
    }
}