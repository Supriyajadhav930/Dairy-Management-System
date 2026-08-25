import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

import secureLogin from "../assets/login/secure-login.png";
import emailIcon from "../assets/login/email_transparent.png";
import lockIcon from "../assets/login/lock_transparent.png";
import eyeIcon from "../assets/login/eye_transparent.png";
import googleIcon from "../assets/login/google.jpg.jpeg";

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    // Login form data
    const [formData, setFormData] = useState({
        email: "",
        password: "",
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

    // Handle login
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
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
                alert(data.message || "Login failed.");
                return;
            }

            // Login successful
            alert(data.message || "Login successful!");

            console.log("Logged-in user:", data.user);

            // Clear form
            setFormData({
                email: "",
                password: "",
            });

        } catch (error) {
            console.error("Login error:", error);

            alert(
                "Unable to connect to the server. Please make sure your backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-container">

                {/* Secure Login Logo */}
                <div className="logo-container">
                    <img
                        src={secureLogin}
                        alt="Secure Login"
                        className="secure-logo"
                    />
                </div>

                {/* Heading */}
                <h1>Login</h1>

                <p className="subtitle">
                    Please login to continue.
                </p>

                <form id="loginForm" onSubmit={handleSubmit}>

                    {/* Email */}
                    <label htmlFor="email">
                        Email Address
                    </label>

                    <div className="input-box">

                        <img
                            src={emailIcon}
                            alt="Email"
                            className="input-icon"
                        />

                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Password */}
                    <label htmlFor="password">
                        Password
                    </label>

                    <div className="input-box">

                        <img
                            src={lockIcon}
                            alt="Password"
                            className="input-icon"
                        />

                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <img
                            src={eyeIcon}
                            alt="Show Password"
                            className="eye-icon"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        />

                    </div>


                    {/* Remember Me + Forgot Password */}
                    <div className="options">

                        <label className="remember">

                            <input type="checkbox" />

                            <span>
                                Remember me
                            </span>

                        </label>

                        <a href="#">
                            Forgot Password?
                        </a>

                    </div>


                    {/* Login Button */}
                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        <span>➜</span>

                        {loading ? "Logging in..." : "Login"}
                    </button>


                    {/* OR */}
                    <div className="or-section">

                        <div className="line"></div>

                        <span>or</span>

                        <div className="line"></div>

                    </div>


                    {/* Google Login */}
                    <button
                        type="button"
                        className="google-btn"
                    >

                        <img
                            src={googleIcon}
                            alt="Google"
                        />

                        <span>
                            Login with Google
                        </span>

                    </button>


                    {/* Sign Up */}
                    <p className="signup-text">

                        Don't have an account?{" "}

                        <Link to="/signup">
                            Sign Up
                        </Link>

                    </p>

                </form>

            </div>

        </div>
    );
}

export default Login;