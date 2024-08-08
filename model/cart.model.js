// import mongoose from "mongoose";
const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true }
})

module.exports = mongoose.model("Cart", CartSchema)