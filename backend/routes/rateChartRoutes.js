
const express = require("express");
const RateChart = require("../models/RateChart");

const router = express.Router();

const isValidDate = (date) =>
    typeof date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    !Number.isNaN(Date.parse(`${date}T00:00:00Z`));

// SAVE a new chart or update the chart for the same date
router.post("/", async (req, res) => {
    try {
        const { date, rateData, snfValues } = req.body;

        if (!isValidDate(date)) {
            return res.status(400).json({
                message: "A valid date in YYYY-MM-DD format is required."
            });
        }

        if (!Array.isArray(rateData) || !Array.isArray(snfValues)) {
            return res.status(400).json({
                message: "rateData and snfValues must be arrays."
            });
        }

        const chart = await RateChart.findOneAndUpdate(
            { date },
            {
                $set: {
                    date,
                    rateData,
                    snfValues: snfValues.map(String)
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        res.status(200).json({
            message: "Rate chart saved successfully.",
            data: chart
        });
    } catch (error) {
        console.error("Error saving rate chart:", error);

        res.status(500).json({
            message: "Failed to save rate chart.",
            error: error.message
        });
    }
});

// GET all saved charts, or one chart for a specified date
router.get("/", async (req, res) => {
    try {
        const { date } = req.query;

        if (date && !isValidDate(date)) {
            return res.status(400).json({
                message: "Date must use YYYY-MM-DD format."
            });
        }

        if (date) {
            const chart = await RateChart.findOne({ date });

            if (!chart) {
                return res.status(404).json({
                    message: "No rate chart found for this date."
                });
            }

            return res.status(200).json(chart);
        }

        const charts = await RateChart.find().sort({ date: -1 });

        res.status(200).json(charts);
    } catch (error) {
        console.error("Error fetching rate charts:", error);

        res.status(500).json({
            message: "Failed to fetch rate charts.",
            error: error.message
        });
    }
});

// DELETE a chart by date
router.delete("/:date", async (req, res) => {
    try {
        const { date } = req.params;

        if (!isValidDate(date)) {
            return res.status(400).json({
                message: "Date must use YYYY-MM-DD format."
            });
        }

        const deletedChart = await RateChart.findOneAndDelete({ date });

        if (!deletedChart) {
            return res.status(404).json({
                message: "No rate chart found for this date."
            });
        }

        res.status(200).json({
            message: "Rate chart deleted successfully.",
            data: deletedChart
        });
    } catch (error) {
        console.error("Error deleting rate chart:", error);

        res.status(500).json({
            message: "Failed to delete rate chart.",
            error: error.message
        });
    }
});

module.exports = router;
