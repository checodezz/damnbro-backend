const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./model/product.model'); // Adjust the path as necessary

dotenv.config(); // Load environment variables from .env file

async function updateExistingProducts() {
    try {
        // Use the environment variable for MongoDB URI
        const mongoURI = process.env.MONGODB;

        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined");
        }

        // Connect to MongoDB
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Update all products to set the `wishlist` field to `false` if it doesn't already exist
        const result = await Product.updateMany(
            {
                $or: [
                    { wishlist: { $exists: false } },
                    { description: { $exists: false } }
                ]
            },
            {
                $set: {
                    wishlist: false,
                    description: ""
                }
            }
        );

        console.log(`Successfully updated ${result.nModified} products.`);
    } catch (error) {
        console.error("Error updating products:", error);
    } finally {
        mongoose.connection.close();
    }
}

updateExistingProducts();
