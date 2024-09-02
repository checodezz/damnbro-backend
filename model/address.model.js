const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: false,
    },
    secondaryMobileNumber: {
        type: String,
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
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
