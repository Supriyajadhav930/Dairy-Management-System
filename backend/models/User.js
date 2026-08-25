const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);


// =====================================
// HASH PASSWORD BEFORE SAVING
// =====================================

userSchema.pre("save", async function () {

    // If password has not changed, don't hash it again
    if (!this.isModified("password")) {
        return;
    }

    // Hash password
    this.password = await bcrypt.hash(this.password, 10);
});


// =====================================
// EXPORT USER MODEL
// =====================================

const User = mongoose.model("User", userSchema);

module.exports = User;