const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["morning", "evening"]
        },

        farmerCode: {
            type: String,
            required: true,
            trim: true
        },

        farmerName: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: String,
            required: true
        },

        litres: {
            type: Number,
            required: true
        },

        fat: {
            type: Number,
            required: true
        },

        snf: {
            type: Number,
            required: true
        },

        degree: {
            type: Number,
            required: true
        },

        rate: {
            type: Number,
            required: true
        },

        amount: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;