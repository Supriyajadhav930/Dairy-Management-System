const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// =========================
// SIGNUP API
// =========================
router.post("/signup", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            confirmPassword
        } = req.body;

        // 1. Check required fields
        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // 2. Check password confirmation
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        // 3. Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }

        // 4. Create user
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            password,
        });

        // 5. Save user to MongoDB
        // Password is automatically hashed
        // by the pre-save function in User.js
        await user.save();

        // 6. Send success response
        res.status(201).json({
            message: "Account created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });

    } catch (error) {
        console.error("Signup error:", error);

        res.status(500).json({
            message: "Server error while creating account",
        });
    }
});


// =========================
// LOGIN API
// =========================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        // 2. Find user by email
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        // 3. Check if user exists
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // 4. Compare entered password
        // with hashed password in MongoDB
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        // 5. Check password
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // 6. Generate JWT token
const token = jwt.sign(
    {
        userId: user._id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

// 7. Login successful
res.status(200).json({
    message: "Login successful",
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
    },
});

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error while logging in",
        });
    }
});


// =========================
// EXPORT ROUTER
// =========================
module.exports = router;