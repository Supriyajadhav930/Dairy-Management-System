import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

import topLogo from "../assets/signup/top.png.png";
import personIcon from "../assets/signup/person.png";
import emailIcon from "../assets/signup/email.png";
import phoneIcon from "../assets/signup/phone.png";
import lockIcon from "../assets/signup/lock.png";
import eyeIcon from "../assets/signup/eye.png";
import arrowIcon from "../assets/signup/arrow.png";
import googleIcon from "../assets/signup/google.jpg.jpeg";

function Signup() {
    // Password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Signup form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    // Loading state
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Handle signup
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check password confirmation
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Signup failed.");
                return;
            }

            // Success
            alert(data.message || "Account created successfully!");

            // Clear form
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error("Signup error:", error);

            alert(
                "Unable to connect to the server. Please make sure your backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        console.log("Google signup clicked");
    };

    return (
        <div className="signup-page">

            <div className="signup-container">

                {/* LOGO */}
                <img
                    src={topLogo}
                    alt="Sairaj Milk"
                    className="top-logo"
                />

                {/* HEADING */}
                <h1>Create Account</h1>

                <div className="heading-line">
                    <span></span>
                    <b>•</b>
                    <span></span>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* FULL NAME */}
                    <div className="input-box">
                        <img
                            src={personIcon}
                            alt="Person"
                            className="input-icon"
                        />

                        <input
                            type="text"
                            id="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="input-box">
                        <img
                            src={emailIcon}
                            alt="Email"
                            className="input-icon"
                        />

                        <input
                            type="email"
                            id="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* PHONE */}
                    <div className="input-box">
                        <img
                            src={phoneIcon}
                            alt="Phone"
                            className="input-icon"
                        />

                        <input
                            type="tel"
                            id="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="input-box">
                        <img
                            src={lockIcon}
                            alt="Password"
                            className="input-icon"
                        />

                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <img
                            src={eyeIcon}
                            alt="Show password"
                            className="eye-icon"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        />
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="input-box">
                        <img
                            src={lockIcon}
                            alt="Confirm Password"
                            className="input-icon"
                        />

                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <img
                            src={eyeIcon}
                            alt="Show password"
                            className="eye-icon"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                        />
                    </div>

                    {/* CREATE ACCOUNT */}
                    <button
                        type="submit"
                        className="create-btn"
                        disabled={loading}
                    >
                        <img
                            src={arrowIcon}
                            alt="Arrow"
                        />

                        <span>
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </span>
                    </button>

                    {/* OR */}
                    <div className="or-section">
                        <span></span>
                        <p>OR</p>
                        <span></span>
                    </div>

                    {/* GOOGLE SIGNUP */}
                    <button
                        type="button"
                        className="google-btn"
                        onClick={handleGoogleSignup}
                    >
                        <img
                            src={googleIcon}
                            alt="Google"
                        />

                        <span>Sign up with Google</span>
                    </button>

                    {/* LOGIN LINK */}
                    <p className="login-text">
                        Already have an account?

                        <Link to="/login">
                            Login
                        </Link>
                    </p>

                </form>

            </div>

        </div>
    );
}

export default Signup;