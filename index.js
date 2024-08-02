const express = require("express")
const app = express()
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json())
const { initializeDatabase } = require("./db/db.connect")
const Product = require("./model/product.model")


initializeDatabase();

app.get("/", (req, res) => {
    res.send("Hello")
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App is up at port ${PORT}`)
})