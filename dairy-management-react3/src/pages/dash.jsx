import "./dash.css";

import morningCollection from "../assets/Dashboard/morning_collection.png";
import eveningCollection from "../assets/Dashboard/evening_collection.png";
import rateManagement from "../assets/Dashboard/rate_management.png";
import farmerManagement from "../assets/Dashboard/farmer_management.png";
import generateBills from "../assets/Dashboard/generate_bills.png";
import billStatement from "../assets/Dashboard/bill_statement.png";
import analytics from "../assets/Dashboard/analytics.png";
import advanceManagement from "../assets/Dashboard/advance_management.png";
import farmersDetails from "../assets/Dashboard/farmers_details.png";
import payment from "../assets/Dashboard/payment.png";

function openPage(pageName) {
    alert(pageName + " selected");
}

function Dash() {
    return (
        <div className="page">

            <div className="dashboard-container">

                {/* HEADER */}
                <header className="dashboard-header">
                    <h1>Dashboard</h1>

                    <div className="leaf-line">
                        <span></span>
                        <div className="leaf">🌿</div>
                        <span></span>
                    </div>
                </header>


                {/* DASHBOARD GRID */}
                <div className="dashboard-grid">

                    {/* LEFT COLUMN */}
                    <div className="dashboard-column">

                        <button
                            className="dashboard-card"
                            onClick={() => openPage("Morning Collection")}
                        >
                            <div className="icon-container">
                                <img
                                    src={morningCollection}
                                    alt="Morning Collection"
                                />
                            </div>

                            <span>Morning Collection</span>
                        </button>


                        <button
                            className="dashboard-card"
                            onClick={() => openPage("Evening Collection")}
                        >
                            <div className="icon-container">
                                <img
                                    src={eveningCollection}
                                    alt="Evening Collection"
                                />
                            </div>

                            <span>Evening Collection</span>
                        </button>


                        <button
                            className="dashboard-card"
                            onClick={() => openPage("Rate Management")}
                        >
                            <div className="icon-container">
                                <img
                                    src={rateManagement}
                                    alt="Rate Management"
                                />
                            </div>

                            <span>Rate Management</span>
                        </button>


                        <button
                            className="dashboard-card"
                            onClick={() => openPage("Farmer Management")}
                        >
                            <div className="icon-container">
                                <img
                                    src={farmerManagement}
                                    alt="Farmer Management"
                                />
                            </div>

                            <span>Farmer Management</span>
                        </button>


                        <button
                            className="dashboard-card"
                            onClick={() => openPage("Generate Bills")}
                        >
                            <div className="icon-container">
                                <img
                                    src={generateBills}
                                    alt="Generate Bills"
                                />
                            </div>

                            <span>Generate Bills</span>
                        </button>

                    </div>


                    {/* CENTER LINE */}
                    <div className="divider"></div>


                    {/* RIGHT COLUMN */}
                    <div className="dashboard-column">

                        <button
                            className="dashboard-card"
                            onClick={() => openPage("Bill Statement")}
                        >
                            <div className="icon-container">
                                <img
                                    src={billStatement}
                                    alt="Bill Statement"
                                />
                            </div>

                            <span>Bill Statement</span>
                        </button>


                        <button
                            className="dashboard-card"
                            onClick={() => openPage("Analytics")}
                        >
                            <div className="icon-container">
                                <img
                                    src={analytics}
                                    alt="Analytics"
                                />
                            </div>

                            <span>Analytics</span>
                        </button>


                        <button
                            className="dashboard-card"
                            onClick={() => openPage("Advance Management")}
                        >
                            <div className="icon-container">
                                <img
                                    src={advanceManagement}
                                    alt="Advance Management"
                                />
                            </div>

                            <span>Advance Management</span>
                        </button>


                        <button
                            className="dashboard-card"
                            onClick={() => openPage("Farmers Details")}
                        >
                            <div className="icon-container">
                                <img
                                    src={farmersDetails}
                                    alt="Farmers Details"
                                />
                            </div>

                            <span>Farmers Details</span>
                        </button>


                        <button
                            className="dashboard-card"
                            onClick={() => openPage("Payment")}
                        >
                            <div className="icon-container">
                                <img
                                    src={payment}
                                    alt="Payment"
                                />
                            </div>

                            <span>Payment</span>
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dash;