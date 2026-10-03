const express = require("express");
const mongoose = require("mongoose");
const Collection = require("../models/Collection");

const router = express.Router();

// ===============================
// SAVE COLLECTION RECORD
// ===============================
router.post("/", async (req, res) => {
    try {
        const collection = new Collection(req.body);

        const savedCollection = await collection.save();

        res.status(201).json({
            message: "Collection record saved successfully",
            data: savedCollection
        });
    } catch (error) {
        console.error("Error saving collection:", error);

        res.status(500).json({
            message: "Failed to save collection record",
            error: error.message
        });
    }
});


// ===============================
// GET COLLECTION RECORDS
// ===============================
router.get("/", async (req, res) => {
    try {
        const { type } = req.query;

        const filter = type ? { type } : {};

        const collections = await Collection
            .find(filter)
            .sort({ date: -1, createdAt: -1 });

        res.status(200).json(collections);
    } catch (error) {
        console.error("Error fetching collections:", error);

        res.status(500).json({
            message: "Failed to fetch collection records",
            error: error.message
        });
    }
});


// ===============================
// UPDATE COLLECTION RECORD
// ===============================
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Check whether the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid collection record ID"
            });
        }

        const updatedCollection =
            await Collection.findByIdAndUpdate(
                id,
                {
                    type: req.body.type,
                    farmerCode: req.body.farmerCode,
                    farmerName: req.body.farmerName,
                    date: req.body.date,
                    litres: Number(req.body.litres),
                    fat: Number(req.body.fat),
                    snf: Number(req.body.snf),
                    degree: Number(req.body.degree),
                    rate: Number(req.body.rate),
                    amount: Number(req.body.amount)
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedCollection) {
            return res.status(404).json({
                message: "Collection record not found"
            });
        }

        res.status(200).json({
            message: "Collection record updated successfully",
            data: updatedCollection
        });

    } catch (error) {
        console.error("Error updating collection:", error);

        res.status(500).json({
            message: "Failed to update collection record",
            error: error.message
        });
    }
});


// ===============================
// DELETE COLLECTION RECORD
// ===============================
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Check whether the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid collection record ID"
            });
        }

        const deletedCollection =
            await Collection.findByIdAndDelete(id);

        if (!deletedCollection) {
            return res.status(404).json({
                message: "Collection record not found"
            });
        }

        res.status(200).json({
            message: "Collection record deleted successfully",
            data: deletedCollection
        });

    } catch (error) {
        console.error("Error deleting collection:", error);

        res.status(500).json({
            message: "Failed to delete collection record",
            error: error.message
        });
    }
});


module.exports = router;