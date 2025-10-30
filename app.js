import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import router from "./router.js"

dotenv.config()

const PORT = process.env.PORT

const app = express()

app.use(cors())
app.use("/api", router)

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})