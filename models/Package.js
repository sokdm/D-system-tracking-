const mongoose = require("mongoose")

const TimelineSchema = new mongoose.Schema({
    location: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    }
})

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
    },

    /* 🔥 NEW COURIER LEVEL FIELDS */

    currentLocation: {
        type: String,
        default: "Shipment Created"
    },

    timeline: [TimelineSchema]

}, { timestamps: true })

module.exports = mongoose.model("Package", PackageSchema)
