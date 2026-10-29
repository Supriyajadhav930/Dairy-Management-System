
const mongoose = require("mongoose");

const rateChartSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true,
            unique: true,
            match: /^\d{4}-\d{2}-\d{2}$/
        },

        // Each row represents one FAT value and its rates for each SNF.
        rateData: [
            {
                fat: {
                    type: Number,
                    required: true
                },

                // Example: { "7.5": 25, "7.6": 25.5 }
                rates: {
                    type: mongoose.Schema.Types.Mixed,
                    default: {}
                }
            }
        ],

        // Example: ["7.5", "7.6", "7.7", "7.8"]
        snfValues: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("RateChart", rateChartSchema);
