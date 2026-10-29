
import { useState } from "react";
import "./Bill_statement.css";

const farmers = {
  "1001": "Ramesh Patil",
  "1002": "Suresh Shinde",
  "1003": "Sunita Pawar",
};

function Bill_statement() {
  const today = new Date().toLocaleDateString("en-CA");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentDate, setCurrentDate] = useState(today);
  const [farmerCode, setFarmerCode] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  const handleCodeChange = (value) => {
    setFarmerCode(value);
    setFarmerName(farmers[value] || "");
    setGenerated(false);
    setError("");
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    setError("");
    setGenerated(false);

    if (!fromDate || !toDate || !currentDate || !farmerCode.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!farmers[farmerCode]) {
      setError("Please enter a valid Farmer Code: 1001, 1002, or 1003.");
      return;
    }

    if (fromDate > toDate) {
      setError("From Date cannot be after To Date.");
      return;
    }

    if (toDate > currentDate) {
      setError("To Date cannot be after Current Date.");
      return;
    }

    setGenerated(true);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bill-page">
      <h1 className="main-title">Bill Statement</h1>

      <form onSubmit={handleGenerate}>
        <div className="top-layout">
          <section className="input-panel date-panel">
            <div className="field">
              <label htmlFor="fromDate">
                <span className="field-icon">▦</span> From Date
              </label>
              <input
                id="fromDate"
                type="date"
                value={fromDate}
                max={currentDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setGenerated(false);
                  setError("");
                }}
              />
            </div>

            <div className="field">
              <label htmlFor="toDate">
                <span className="field-icon">▦</span> To Date
              </label>
              <input
                id="toDate"
                type="date"
                value={toDate}
                min={fromDate || undefined}
                max={currentDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setGenerated(false);
                  setError("");
                }}
              />
            </div>

            <div className="field">
              <label htmlFor="currentDate">
                <span className="field-icon">▦</span> Current Date
              </label>
              <input
                id="currentDate"
                type="date"
                value={currentDate}
                onChange={(e) => {
                  setCurrentDate(e.target.value);
                  setGenerated(false);
                  setError("");
                }}
              />
            </div>
          </section>

          <section className="input-panel farmer-panel">
            <div className="field">
              <label htmlFor="farmerCode">
                <span className="field-icon">♙</span> Farmer Selection
              </label>

              <input
                id="farmerCode"
                type="text"
                placeholder="Enter Code"
                value={farmerCode}
                onChange={(e) => handleCodeChange(e.target.value)}
              />
            </div>

            <div className="field farmer-name-field">
              <label className="farmer-label">
                <span className="field-icon">♙</span> Farmer Name
              </label>
              <input
                type="text"
                placeholder="Farmer Name"
                value={farmerName}
                readOnly
              />
            </div>
          </section>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="generate-wrapper">
          <button type="submit" className="generate-button">
            Generate Statement
          </button>
        </div>
      </form>

      <section className="statement-preview">
        {!generated ? (
          <div className="empty-preview">
            Generated statement will appear here after clicking the button.
          </div>
        ) : (
          <div className="generated-content">
            <h2>Sairaj Milk Dairy</h2>
            <h3>Farmer Bill Statement</h3>

            <div className="generated-details">
              <p><strong>Farmer Code:</strong> {farmerCode}</p>
              <p><strong>Farmer Name:</strong> {farmerName}</p>
              <p><strong>From Date:</strong> {formatDate(fromDate)}</p>
              <p><strong>To Date:</strong> {formatDate(toDate)}</p>
              <p><strong>Current Date:</strong> {formatDate(currentDate)}</p>
            </div>

            <div className="billing-message">
              Billing records are not connected yet. Connect your database
              to display milk quantity, rate, and total amount.
            </div>

            <button
              type="button"
              className="print-button"
              onClick={() => window.print()}
            >
              Print Statement
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Bill_statement;
