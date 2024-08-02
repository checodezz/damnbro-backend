// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose")
const ProductSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    category: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    }
}, { timestamps: true })


module.exports = mongoose.model("Product", ProductSchema)
