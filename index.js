const express = require("express")
const app = express()
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json())
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connect")
const Product = require("./model/product.model");
const Cart = require("./model/cart.model");


const corsOptions = {
    origin: "*",
    credentials: true
}

app.use(cors(corsOptions))
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

app.get("/products/all", async (req, res) => {
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


//search by categories

async function productsByCategory(category) {
    try {
        const products = await Product.find({ category: new RegExp(`^${category}$`, 'i') })
        return products;
    } catch (error) {
        throw error
    }
}

app.get("/products/:category", async (req, res) => {
    const { category } = req.params;
    try {
        const products = await productsByCategory(category);
        if (products && products.length > 0) {
            res.status(200).json({ message: "Products retrieved successfully", products });
        } else {
            res.status(404).json({ error: "No products found for this category" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch category." })
    }
})

//product by id 

async function getProductById(productId) {
    try {
        const product = await Product.findById(productId);
        return product;
    } catch (error) {
        throw error
    }
}


app.get("/product/:productId", async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await getProductById(productId);
        if (product) {
            res.status(200).json({ message: "Product fetching successful", product })
        } else {
            res.status(404).json({ message: "Product not found." })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "failed to fetch Product" })
    }
})



//Cart api's
//add to cart;

async function addToCart(productId) {
    try {
        let cartItem = await Cart.findOne({ productId });
        if (cartItem) {
            cartItem.quantity += 1
            await cartItem.save()
        } else {
            cartItem = new Cart({ productId, quantity: 1 });
            await cartItem.save()
        }

        const populatedCartItem = await Cart.findById(cartItem._id).populate('productId')
        return populatedCartItem;

    } catch (error) {
        throw error
    }
}

app.post("/cart", async (req, res) => {
    console.log(req.body)
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        const product = await addToCart(productId);
        res.status(200).json({ message: "product added successfully.", product })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App is up at port ${PORT}`)
})