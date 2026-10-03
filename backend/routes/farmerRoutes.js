const express = require("express");
const mongoose = require("mongoose");
const Farmer = require("../models/Farmer");

const router = express.Router();


// =====================================================
// ADD FARMER
// =====================================================
router.post("/", async (req, res) => {
    try {
        const farmer = new Farmer(req.body);

        const savedFarmer = await farmer.save();

        res.status(201).json({
            message: "Farmer added successfully",
            data: savedFarmer
        });

    } catch (error) {
        console.error("Error adding farmer:", error);

        // Duplicate farmer code
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Farmer code already exists"
            });
        }

        res.status(500).json({
            message: "Failed to add farmer",
            error: error.message
        });
    }
});


// =====================================================
// GET ALL FARMERS
// =====================================================
router.get("/", async (req, res) => {
    try {
        const farmers = await Farmer
            .find()
            .sort({ createdAt: -1 });

        res.status(200).json(farmers);

    } catch (error) {
        console.error("Error fetching farmers:", error);

        res.status(500).json({
            message: "Failed to fetch farmers",
            error: error.message
        });
    }
});


// =====================================================
// UPDATE FARMER
// =====================================================
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Check MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid farmer ID"
            });
        }

        const updatedFarmer = await Farmer.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedFarmer) {
            return res.status(404).json({
                message: "Farmer not found"
            });
        }

        res.status(200).json({
            message: "Farmer updated successfully",
            data: updatedFarmer
        });

    } catch (error) {
        console.error("Error updating farmer:", error);

        // Duplicate farmer code
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Farmer code already exists"
            });
        }

        res.status(500).json({
            message: "Failed to update farmer",
            error: error.message
        });
    }
});


// =====================================================
// DELETE FARMER
// =====================================================
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Check MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid farmer ID"
            });
        }

        const deletedFarmer =
            await Farmer.findByIdAndDelete(id);

        if (!deletedFarmer) {
            return res.status(404).json({
                message: "Farmer not found"
            });
        }

        res.status(200).json({
            message: "Farmer deleted successfully",
            data: deletedFarmer
        });

    } catch (error) {
        console.error("Error deleting farmer:", error);

        res.status(500).json({
            message: "Failed to delete farmer",
            error: error.message
        });
    }
});


module.exports = router;