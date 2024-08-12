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

//add to cart or update quantity
async function updateCart(productId, operation) {
    try {
        const incrementValue = operation === "increment" ? 1 : -1;
        const product = await Cart.findOneAndUpdate(
            { productId: productId },
            { $inc: { quantity: incrementValue } },
            { new: true, upsert: true }
        ).populate("productId");

        if (product && product.quantity <= 0) {
            await Cart.findByIdAndDelete(product._id);
            return { deletedProductId: product._id };
        }
        return product
    } catch (error) {
        throw error;
    }
}


app.post("/cart", async (req, res) => {
    const { productId, operation } = req.body;
    console.log("Received data:", { productId, operation });
    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }
    try {
        const product = await updateCart(productId, operation);
        if (product) {
            res.status(200).json({ message: "Product updated successfully.", product });
        } else {
            res.status(200).json({ message: "Product removed from the cart." });
        }
    } catch (error) {
        console.error('Error in /cart endpoint:', error);
        res.status(500).json({ error: "An error occurred while updating the cart." });
    }
});

//delete item from cart 
async function deleteProductFromCart(productId) {

    try {
        const product = await Cart.findByIdAndDelete(productId)
        return product
    } catch (error) {
        console.log(error)
        throw error
    }
}

app.delete("/cart/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await deleteProductFromCart(id);

        if (deletedProduct) {
            res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while deleting the product" });
    }
});

//fetch cart items
async function fetchCart() {
    try {
        const cart = await Cart.find().populate("productId")
        return cart
    } catch (error) {
        throw error
    }
}

app.get("/cart", async (req, res) => {
    try {
        const cart = await fetchCart();
        if (cart) {
            res.status(200).json({ message: "Cart items", cart })
        } else {
            res.status(404).json({ error: "Cart items not found." })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to get   data from cart" })
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App is up at port ${PORT}`)
})