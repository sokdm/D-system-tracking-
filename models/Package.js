const mongoose = require("mongoose")

const PackageSchema = new mongoose.Schema({
    trackingCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    customerName: {
        type: String,
        default: "",
        trim: true
    },

    phone: {
        type: String,
        default: "",
        trim: true
    },

    address: {
        type: String,
        default: "",
        trim: true
    },

    weight: {
        type: String,
        default: "",
        trim: true
    },

    description: {
        type: String,
        default: "",
        trim: true
    },

    departureDate: {
        type: String,
        default: ""
    },

    arrivalEstimate: {
        type: String,
        default: ""
    },

    image: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        default: "Pending"
    }

}, { timestamps: true })

module.exports = mongoose.model("Package", PackageSchema)
