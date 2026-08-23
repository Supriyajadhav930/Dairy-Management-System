import './About.css';

import logo from '../assets/about/logo.png';
import missionIcon from '../assets/about/misson icon.png';
import visionIcon from "../assets/about/vission.png";
import bottleIcon from '../assets/about/bottle icon.png';
import flaskImage from '../assets/about/falsk.jpg';
import farmerImage from '../assets/about/farmer.png';
import computerImage from '../assets/about/computer.png';

function About() {
    return (
        <>
            {/* ================= HEADER ================= */}

            <header className="navbar">
                <div className="nav-container">

                    {/* Logo */}
                    <a href="/" className="logo-link">
                        <div className="brand-logo">
                            <img
                                src={logo}
                                alt="Sairaj Milk Collection Centre Logo"
                                className="logo-img"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';

                                    const fallback =
                                        e.currentTarget.nextElementSibling;

                                    if (fallback) {
                                        fallback.style.display = 'flex';
                                    }
                                }}
                            />

                            <div className="logo-circle-fallback">
                                <span className="cow-icon">🐮</span>
                            </div>
                        </div>
                    </a>

                    {/* Navigation */}
                    <nav className="nav-menu">

                        <a href="/" className="nav-item">
                            Home
                        </a>

                        <a href="/about" className="nav-item active">
                            About Us
                        </a>

                        <a href="/contact" className="nav-item">
                            Contact
                        </a>

                    </nav>

                </div>
            </header>


            {/* ================= MAIN CONTENT ================= */}

            <main className="about-page">

                <div className="main-container">

                    {/* ================= COMBINED SINGLE-CARD VIEW ================= */}

                    <section className="combined-about-card">

                        {/* ================= ABOUT HERO ================= */}

                        <div className="about-hero">

                            <div className="hero-center-content">

                                <h1 className="hero-title">
                                    About Sairaj Milk Collection Centre
                                </h1>

                                <p className="hero-tagline">
                                    Delivering Freshness, Building Trust and
                                    Empowering Dairy Farmers Every Day.
                                </p>

                            </div>

                        </div>


                        {/* Divider */}
                        <hr className="card-divider" />


                        {/* ================= OUR STORY ================= */}

                        <div className="story-section">

                            <div className="section-title">

                                <span className="leaf-icon">🌿</span>

                                <h2>OUR STORY</h2>

                                <span className="leaf-icon">🌿</span>

                            </div>

                            <p className="story-text">
                                <strong>Sairaj Dairy Collection Centre</strong>{' '}
                                is committed to collecting fresh, hygienic,
                                and high-quality milk directly from local
                                farmers. We ensure transparency, quality
                                testing, and accurate digital records to
                                maintain trust and build long-term
                                relationships.
                            </p>

                        </div>


                        <hr className="card-divider" />


                        {/* ================= MISSION AND VISION ================= */}

                        <div className="mv-grid">

                            {/* Mission */}
                            <div className="mv-box">

                                <div className="mv-icon-wrapper">

                                    <img
                                        src={missionIcon}
                                        alt="Mission Icon"
                                        className="mv-icon"
                                    />

                                </div>

                                <div className="mv-details">

                                    <h3>OUR MISSION</h3>

                                    <p>
                                        To provide efficient and transparent
                                        milk collection services while
                                        ensuring quality, hygiene, and timely
                                        payments to farmers.
                                    </p>

                                </div>

                            </div>


                            {/* Vision */}
                            <div className="mv-box">

                                <div className="mv-icon-wrapper">

                                    <img
                                        src={visionIcon}
                                        alt="Vision Icon"
                                        className="mv-icon"
                                    />

                                </div>

                                <div className="mv-details">

                                    <h3>OUR VISION</h3>

                                    <p>
                                        To become one of the most trusted
                                        dairy management centres by combining
                                        modern technology with traditional
                                        values.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* ================= WHY CHOOSE US ================= */}

                    <section className="why-choose-section">

                        <div className="why-title-box">

                            <h2>WHY CHOOSE US?</h2>

                            <div className="small-divider">

                                <span className="mini-line"></span>

                                <span className="mini-dot">🍃</span>

                                <span className="mini-line"></span>

                            </div>

                        </div>


                        <div className="features-grid">

                            {/* Fresh Milk */}
                            <div className="card feature-card">

                                <div className="feature-icon-wrapper">

                                    <img
                                        src={bottleIcon}
                                        alt="Fresh Milk"
                                        className="feature-icon"
                                    />

                                </div>

                                <div className="feature-info">

                                    <h4>FRESH MILK</h4>

                                    <p>
                                        Fresh milk collected directly from
                                        farmers every day.
                                    </p>

                                </div>

                            </div>


                            {/* Quality Testing */}
                            <div className="card feature-card">

                                <div className="feature-icon-wrapper">

                                    <img
                                        src={flaskImage}
                                        alt="Quality Testing"
                                        className="feature-icon round-img"
                                    />

                                </div>

                                <div className="feature-info">

                                    <h4>QUALITY TESTING</h4>

                                    <p>
                                        Every milk sample is tested for Fat
                                        and SNF content.
                                    </p>

                                </div>

                            </div>


                            {/* Farmer Support */}
                            <div className="card feature-card">

                                <div className="feature-icon-wrapper">

                                    <img
                                        src={farmerImage}
                                        alt="Farmer Support"
                                        className="feature-icon round-img"
                                    />

                                </div>

                                <div className="feature-info">

                                    <h4>FARMER SUPPORT</h4>

                                    <p>
                                        Transparent digital records and
                                        timely payments.
                                    </p>

                                </div>

                            </div>


                            {/* Digital Management */}
                            <div className="card feature-card">

                                <div className="feature-icon-wrapper">

                                    <img
                                        src={computerImage}
                                        alt="Digital Management"
                                        className="feature-icon round-img"
                                    />

                                </div>

                                <div className="feature-info">

                                    <h4>DIGITAL MANAGEMENT</h4>

                                    <p>
                                        Complete digital dairy management
                                        with secure records.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>

                </div>

            </main>
        </>
    );
}

export default About;