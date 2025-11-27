import { getConnection } from "./src/repositories/db/connection.js"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import router from "./src/router.js"

dotenv.config()

const PORT = process.env.PORT
const CLIENT_URL = process.env.CLIENT_URL

const app = express()

app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser()) // Necesario para leer cookies
app.use("/api", router)

// ESTO ES PARA PROBAR LA CONEXIÓN
// DESCOMENTAR PARA PROBAR BASES DE DATOS
// try {
//     const sequelize = await getConnection();
//     await sequelize.query("SELECT 1+1 AS result");
//     console.log("Test query successful!");
//     process.exit(0);
// } catch (err) {
//     console.error("Connection test failed!");
//     process.exit(1);
// }

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})