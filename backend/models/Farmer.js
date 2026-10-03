const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            match: /^[0-9]{10}$/
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            match: /^[a-z0-9]+@gmail\.com$/
        },

        phonePay: {
            type: String,
            required: true,
            match: /^[0-9]{10}$/
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Farmer", farmerSchema);