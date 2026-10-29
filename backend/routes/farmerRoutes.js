
import { useState, useEffect } from "react";
import "./Bill_statement.css";

// Change this URL if your backend mounts farmerRoutes at a different path.
const FARMERS_API = "http://localhost:5000/api/farmers";

function Bill_statement() {
  const getToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentDate, setCurrentDate] = useState(getToday());

  const [farmerCode, setFarmerCode] = useState("");
  const [farmerName, setFarmerName] = useState("");

  const [farmers, setFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);
  const [farmersError, setFarmersError] = useState("");

  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  // Fetch farmers saved in Farmer Management.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchFarmers() {
      try {
        setLoadingFarmers(true);
        setFarmersError("");

        const response = await fetch(FARMERS_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load farmers from the backend.");
        }

        const data = await response.json();

        // Supports an array or an object containing a farmers array.
        const farmerList = Array.isArray(data)
          ? data
          : Array.isArray(data.farmers)
            ? data.farmers
            : Array.isArray(data.data)
              ? data.data
              : null;

        if (!farmerList) {
          throw new Error("The backend returned an unexpected farmer list.");
        }

        setFarmers(farmerList);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching farmers:", err);
          setFarmersError(
            "Could not load farmers. Check the backend connection and API URL."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingFarmers(false);
        }
      }
    }

    fetchFarmers();

    return () => controller.abort();
  }, []);

  // Match the entered code with a saved Farmer Management record.
  const handleCodeChange = (value) => {
    setFarmerCode(value);
    setGenerated(false);
    setError("");

    const enteredCode = value.trim();

    const farmer = farmers.find((item) => {
      const savedCode =
        item.farmerCode ??
        item.farmer_code ??
        item.code;

      return (
        savedCode !== undefined &&
        savedCode !== null &&
        String(savedCode).trim() === enteredCode
      );
    });

    const savedName = farmer
      ? farmer.farmerName ??
        farmer.farmer_name ??
        farmer.name ??
        ""
      : "";

    setFarmerName(savedName);
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    setError("");
    setGenerated(false);

    if (loadingFarmers) {
      setError("Please wait while farmer records are loading.");
      return;
    }

    if (farmersError) {
      setError("Farmer records could not be loaded. Please check the backend.");
      return;
    }

    if (
      !fromDate ||
      !toDate ||
      !currentDate ||
      !farmerCode.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const selectedFarmer = farmers.find((item) => {
      const savedCode =
        item.farmerCode ??
        item.farmer_code ??
        item.code;

      return (
        savedCode !== undefined &&
        savedCode !== null &&
        String(savedCode).trim() === farmerCode.trim()
      );
    });

    if (!selectedFarmer) {
      setFarmerName("");
      setError("Farmer not found. Please enter a valid Farmer Code.");
      return;
    }

    if (fromDate > toDate) {
      setError("From Date cannot be after To Date.");
      return;
    }

    if (toDate > currentDate || fromDate > currentDate) {
      setError("Statement dates cannot be after Current Date.");
      return;
    }

    setFarmerName(
      selectedFarmer.farmerName ??
      selectedFarmer.farmer_name ??
      selectedFarmer.name ??
      ""
    );

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
                placeholder={
                  loadingFarmers
                    ? "Loading farmers..."
                    : "Enter Code"
                }
                value={farmerCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                disabled={loadingFarmers || Boolean(farmersError)}
              />
            </div>

            <div className="field farmer-name-field">
              <label htmlFor="farmerName" className="farmer-label">
                <span className="field-icon">♙</span> Farmer Name
              </label>

              <input
                id="farmerName"
                type="text"
                placeholder={
                  farmersError
                    ? "Unable to load farmers"
                    : "Farmer Name"
                }
                value={farmerName}
                readOnly
              />
            </div>
          </section>
        </div>

        {farmersError && (
          <p className="error-message">{farmersError}</p>
        )}

        {error && <p className="error-message">{error}</p>}

        {!loadingFarmers && !farmersError && (
          <div className="generate-wrapper">
            <button type="submit" className="generate-button">
              Generate Statement
            </button>
          </div>
        )}

        {loadingFarmers && (
          <p>Loading farmer records...</p>
        )}
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
              <p>
                <strong>Farmer Code:</strong> {farmerCode}
              </p>
              <p>
                <strong>Farmer Name:</strong> {farmerName}
              </p>
              <p>
                <strong>From Date:</strong> {formatDate(fromDate)}
              </p>
              <p>
                <strong>To Date:</strong> {formatDate(toDate)}
              </p>
              <p>
                <strong>Current Date:</strong> {formatDate(currentDate)}
              </p>
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
