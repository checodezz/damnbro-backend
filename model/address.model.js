const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: Number,
        required: false,
    },
    secondaryMobileNumber: {
        type: Number,
        required: false,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    postalCode: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
