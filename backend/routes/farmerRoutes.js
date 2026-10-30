
const express = require("express");
const router = express.Router();

const Farmer = require("../models/Farmer");

// GET: Fetch all farmers
router.get("/", async (req, res) => {
    try {
        const farmers = await Farmer.find().sort({ code: 1 });

        res.status(200).json({
            success: true,
            farmers: farmers
        });

    } catch (error) {
        console.error("Error fetching farmers:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch farmers",
            error: error.message
        });
    }
});

// POST: Add a new farmer
router.post("/", async (req, res) => {
    try {
        const { code, name, phone, email, phonePay } = req.body;

        const existingFarmer = await Farmer.findOne({ code });

        if (existingFarmer) {
            return res.status(400).json({
                success: false,
                message: "Farmer code already exists"
            });
        }

        const newFarmer = new Farmer({
            code,
            name,
            phone,
            email,
            phonePay
        });

        await newFarmer.save();

        res.status(201).json({
            success: true,
            message: "Farmer added successfully",
            farmer: newFarmer
        });

    } catch (error) {
        console.error("Error adding farmer:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add farmer",
            error: error.message
        });
    }
});

module.exports = router;
