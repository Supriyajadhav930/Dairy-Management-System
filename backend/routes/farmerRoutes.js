
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Farmer = require("../models/Farmer");

// =====================================================
// GET ALL FARMERS
// =====================================================

router.get("/", async (req, res) => {
    try {
        const farmers = await Farmer.find().sort({ code: 1 });

        return res.status(200).json({
            success: true,
            farmers
        });

    } catch (error) {
        console.error("Fetch farmers error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch farmers",
            error: error.message
        });
    }
});


// =====================================================
// ADD NEW FARMER
// =====================================================

router.post("/", async (req, res) => {
    try {
        const { code, name, phone, email, phonePay } = req.body;

        if (!code || !name || !phone || !email || !phonePay) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const farmerCode = String(code).trim();

        const existingFarmer = await Farmer.findOne({
            code: farmerCode
        });

        if (existingFarmer) {
            return res.status(409).json({
                success: false,
                message: "Farmer code already exists"
            });
        }

        const farmer = new Farmer({
            code: farmerCode,
            name: name.trim(),
            phone: String(phone),
            email: email.trim().toLowerCase(),
            phonePay: String(phonePay)
        });

        await farmer.save();

        return res.status(201).json({
            success: true,
            message: "Farmer added successfully",
            farmer
        });

    } catch (error) {
        console.error("Add farmer error:", error);

        return res.status(error.code === 11000 ? 409 : 400).json({
            success: false,
            message: error.code === 11000
                ? "Farmer code already exists"
                : error.message
        });
    }
});


// =====================================================
// UPDATE EXISTING FARMER
// =====================================================

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid farmer ID"
            });
        }

        const { code, name, phone, email, phonePay } = req.body;

        if (!code || !name || !phone || !email || !phonePay) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const updatedFarmer = await Farmer.findByIdAndUpdate(
            id,
            {
                code: String(code).trim(),
                name: name.trim(),
                phone: String(phone),
                email: email.trim().toLowerCase(),
                phonePay: String(phonePay)
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedFarmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Farmer updated successfully",
            farmer: updatedFarmer
        });

    } catch (error) {
        console.error("Update farmer error:", error);

        return res.status(error.code === 11000 ? 409 : 400).json({
            success: false,
            message: error.code === 11000
                ? "Farmer code already exists"
                : error.message
        });
    }
});


// =====================================================
// DELETE FARMER
// =====================================================

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid farmer ID"
            });
        }

        const deletedFarmer = await Farmer.findByIdAndDelete(id);

        if (!deletedFarmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Farmer deleted successfully"
        });

    } catch (error) {
        console.error("Delete farmer error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete farmer",
            error: error.message
        });
    }
});

module.exports = router;
