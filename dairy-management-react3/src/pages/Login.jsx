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

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Login form submitted");
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
                    >
                        <span>➜</span>
                        Login
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