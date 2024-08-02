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

//get all products route.
async function getAllProducts() {
    try {
        const products = await Product.find();
        return products
    } catch (error) {
        throw error
    }
}

app.get("/products", async (req, res) => {
    try {
        const products = await getAllProducts();
        if (products) {
            res.status(200).json({ message: "All products", products })
        } else {
            res.status(404).json({ error: "Products not found" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to get products" })
    }
})

//add a product
async function addProduct(newProduct) {
    try {
        const product = new Product(newProduct);
        const saveProduct = await product.save();
        return saveProduct
    } catch (error) {
        throw error;
    }
}


app.post("/products", async (req, res) => {
    try {
        const product = await addProduct(req.body);
        if (product) {
            res.status(200).json({ message: "Product added successfully", product })
        } else {
            res.status(404).json({ error: "Unable to add products." })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to add product" })
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App is up at port ${PORT}`)
})