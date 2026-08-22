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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Signup form submitted");
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
                    >
                        <img
                            src={arrowIcon}
                            alt="Arrow"
                        />

                        <span>Create Account</span>
                    </button>

                    {/* OR */}
                    <div className="or-section">

                        <span></span>

                        <p>OR</p>

                        <span></span>

                    </div>

                    {/* GOOGLE */}
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

                    {/* LOGIN */}
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