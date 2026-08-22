import "./Contact.css";

import logo from "../assets/contact/logo.png";
import leftLeaf from "../assets/contact/left leaf.png";
import rightLeaf from "../assets/contact/right leaf.png";
import milkBottle from "../assets/contact/milk bottle.png";
import freshIcon from "../assets/contact/fresh icon.png";
import callLogo from "../assets/contact/call logo.png";
import mailLogo from "../assets/contact/mail logo.png";
import mapLogo from "../assets/contact/map logo.png";
import timeLogo from "../assets/contact/time logo.png";
import milkSplash from "../assets/contact/milk splash.png";
import qualityIcon from "../assets/contact/quality icon.png";
import serviceIcon from "../assets/contact/service icon.png";
import customerIcon from "../assets/contact/customer icon.png";

function Contact() {
    return (
        <>
            {/* ================= NAVBAR ================= */}

            <nav className="navbar navbar-expand-lg custom-navbar">

                <div className="container">

                    {/* LOGO */}

                    <a className="navbar-brand" href="/">
                        <img
                            src={logo}
                            alt="Sairaj Milk Collection Centre Logo"
                            className="brand-logo"
                        />
                    </a>


                    {/* MOBILE MENU BUTTON */}

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>


                    {/* NAVIGATION */}

                    <div
                        className="collapse navbar-collapse justify-content-end"
                        id="navbarNav"
                    >

                        <ul className="navbar-nav">

                            {/* HOME */}

                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="/"
                                >
                                    Home
                                </a>
                            </li>


                            {/* ABOUT */}

                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="/about"
                                >
                                    About Us
                                </a>
                            </li>


                            {/* CONTACT */}

                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    href="/contact"
                                >
                                    Contact
                                </a>
                            </li>

                        </ul>

                    </div>

                </div>

            </nav>


            {/* ================= CONTACT SECTION ================= */}

            <main className="contact-section">

                {/* LEFT LEAF */}

                <img
                    src={leftLeaf}
                    className="left-leaf"
                    alt=""
                />


                {/* RIGHT LEAF */}

                <img
                    src={rightLeaf}
                    className="right-leaf"
                    alt=""
                />


                {/* CONTACT CARD */}

                <div className="container contact-container">

                    <div className="contact-card">

                        {/* MILK BOTTLE */}

                        <div className="bottle-icon">

                            <img
                                src={milkBottle}
                                alt="Milk Bottle"
                            />

                        </div>


                        {/* CONTACT TITLE */}

                        <div className="contact-title">

                            <h1>Contact Us</h1>

                            <div className="title-decoration">

                                <span></span>

                                <img
                                    src={freshIcon}
                                    alt=""
                                />

                                <span></span>

                            </div>

                        </div>


                        {/* CONTACT INFORMATION */}

                        <div className="contact-info">

                            {/* PHONE */}

                            <div className="contact-item">

                                <div className="contact-icon">

                                    <img
                                        src={callLogo}
                                        alt="Phone"
                                    />

                                </div>

                                <div className="contact-text">

                                    <h5>Phone</h5>

                                    <p>
                                        <a href="tel:888707609">
                                            888707609
                                        </a>
                                    </p>

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="contact-item">

                                <div className="contact-icon">

                                    <img
                                        src={mailLogo}
                                        alt="Email"
                                    />

                                </div>

                                <div className="contact-text">

                                    <h5>Email</h5>

                                    <p>
                                        <a href="mailto:sairajmilkcollection@gmail.com">
                                            sairajmilkcollection@gmail.com
                                        </a>
                                    </p>

                                </div>

                            </div>


                            {/* ADDRESS */}

                            <div className="contact-item">

                                <div className="contact-icon">

                                    <img
                                        src={mapLogo}
                                        alt="Address"
                                    />

                                </div>

                                <div className="contact-text">

                                    <h5>Address</h5>

                                    <p>
                                        At Shiregaon, Tal- Newasa,
                                        <br />
                                        Dist- Ahilyanagar
                                    </p>

                                </div>

                            </div>


                            {/* WORKING HOURS */}

                            <div className="contact-item last-item">

                                <div className="contact-icon">

                                    <img
                                        src={timeLogo}
                                        alt="Working Hours"
                                    />

                                </div>

                                <div className="contact-text">

                                    <h5>Working Hours</h5>

                                    <p>
                                        Morning: 7:00 AM to 9:00 AM
                                    </p>

                                    <p>
                                        Evening: 7:00 PM to 9:00 PM
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= MILK SPLASH ================= */}

                <img
                    src={milkSplash}
                    className="milk-splash left-splash"
                    alt=""
                />

                <img
                    src={milkSplash}
                    className="milk-splash right-splash"
                    alt=""
                />

            </main>


            {/* ================= FEATURES SECTION ================= */}

            <section className="features-section">

                <div className="container">

                    <div className="row g-0">

                        {/* QUALITY */}

                        <div className="col-lg-3 col-md-6 feature-column">

                            <div className="feature-item">

                                <img
                                    src={qualityIcon}
                                    alt="Quality Assurance"
                                />

                                <div>

                                    <h5>Quality Assurance</h5>

                                    <p>
                                        Pure milk, every time.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* SERVICE */}

                        <div className="col-lg-3 col-md-6 feature-column">

                            <div className="feature-item">

                                <img
                                    src={serviceIcon}
                                    alt="Trusted Service"
                                />

                                <div>

                                    <h5>Trusted Service</h5>

                                    <p>
                                        Your trust is our promise.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* FRESH */}

                        <div className="col-lg-3 col-md-6 feature-column">

                            <div className="feature-item">

                                <img
                                    src={freshIcon}
                                    alt="Fresh and Natural"
                                />

                                <div>

                                    <h5>Fresh & Natural</h5>

                                    <p>
                                        Straight from our farmers.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* CUSTOMER */}

                        <div className="col-lg-3 col-md-6 feature-column last-feature">

                            <div className="feature-item">

                                <img
                                    src={customerIcon}
                                    alt="Customer First"
                                />

                                <div>

                                    <h5>Customer First</h5>

                                    <p>
                                        We're here for you.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </>
    );
}

export default Contact;