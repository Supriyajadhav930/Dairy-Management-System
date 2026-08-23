import logo from "../assets/home/logo.png";
import heroBg from "../assets/home/hero-bg.png";
import bottle from "../assets/home/Bottle.png";
import milkSplash from "../assets/home/Milk-Splash.png";
import waveBg from "../assets/home/wave-bg.png";

import "./Home.css";

function Home() {
  return (
    <>
      {/* ================= HEADER / NAVBAR ================= */}

      <header className="header">
        <div className="header-container">

          {/* LOGO */}
          <div className="logo-area">
            <img
              src={logo}
              alt="Sairaj Milk Collection Centre Logo"
              className="main-logo"
            />
          </div>

          {/* NAVIGATION */}
          <nav className="nav">

            {/* HOME */}
            <a
              href="/"
              className="nav-link active"
            >
              Home
            </a>

            {/* ABOUT */}
            <a
              href="/about"
              className="nav-link"
            >
              About Us
            </a>

            {/* CONTACT */}
            <a
              href="/contact"
              className="nav-link"
            >
              Contact
            </a>

          </nav>
        </div>
      </header>


      {/* ================= MAIN HERO SECTION ================= */}

      <main className="hero">

        {/* RIGHT BACKGROUND IMAGE */}
        <div className="hero-bg-container">
          <img
            src={heroBg}
            alt="Dairy Farm Background"
            className="hero-bg-image"
          />
        </div>


        {/* LEFT OFF-WHITE CURVED PANEL */}
        <div className="curved-bg-panel"></div>


        {/* HERO CONTENT */}
        <div className="hero-container">

          <div className="hero-text-content">

            {/* TITLE */}
            <h1 className="hero-title">
              Sairaj Milk
              <br />
              Collection Centre
            </h1>


            {/* DIVIDER WITH MILK BOTTLE */}
            <div className="icon-divider">

              <span className="line"></span>

              <img
                src={bottle}
                alt="Milk Bottle"
                className="divider-icon"
              />

              <span className="line"></span>

            </div>


            {/* DESCRIPTION */}
            <p className="hero-description">
              We collect pure milk with care, maintain quality
              with trust and deliver happiness every day.
            </p>


            {/* ACTION BUTTONS */}
            <div className="cta-buttons">

              {/* LOGIN BUTTON */}
              <a
                href="/login"
                className="btn btn-login"
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                Login
              </a>


              {/* SIGN UP BUTTON */}
              <a
                href="/signup"
                className="btn btn-signup"
              >
                <i className="fa-solid fa-user"></i>
                Sign Up
              </a>

            </div>

          </div>
        </div>


        {/* ================= MILK SPLASH ================= */}

        <div className="milk-splash-container">
          <img
            src={milkSplash}
            alt="Milk Splash"
            className="milk-splash-img"
          />
        </div>


        {/* ================= BOTTOM WAVE ================= */}

        <div className="bottom-wave-container">
          <img
            src={waveBg}
            alt="Bottom Wave"
            className="wave-img"
          />
        </div>

      </main>
    </>
  );
}

export default Home;