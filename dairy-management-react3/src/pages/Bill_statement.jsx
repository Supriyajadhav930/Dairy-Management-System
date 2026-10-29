import { useState, useEffect, useRef } from "react";
import "./Bill_statement.css";

const FARMERS_API = "http://localhost:5000/api/farmers";

function Bill_statement() {
  const getToday = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentDate, setCurrentDate] = useState(getToday());

  const [farmerCode, setFarmerCode] = useState("");
  const [farmerName, setFarmerName] = useState("");

  const [farmers, setFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  const toDateRef = useRef(null);
  const farmerCodeRef = useRef(null);

  // Fetch farmers from the backend database.
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoadingFarmers(true);

        const response = await fetch(FARMERS_API);

        if (!response.ok) {
          throw new Error("Unable to fetch farmer records.");
        }

        const result = await response.json();

        const farmerList = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.farmers)
              ? result.farmers
              : [];

        setFarmers(farmerList);
      } catch (err) {
        console.error("Error fetching farmers:", err);
        setError(
          "Could not load farmers. Please check whether the backend is running."
        );
      } finally {
        setLoadingFarmers(false);
      }
    };

    fetchFarmers();
  }, []);

  // Read the farmer code and name using common database field names.
  const getFarmerCode = (farmer) =>
    String(
      farmer.farmerCode ??
        farmer.farmer_code ??
        farmer.code ??
        farmer.farmerId ??
        farmer.farmer_id ??
        ""
    ).trim();

  const getFarmerName = (farmer) =>
    farmer.farmerName ??
    farmer.farmer_name ??
    farmer.name ??
    farmer.fullName ??
    farmer.full_name ??
    "";

  const handleCodeChange = (value) => {
    setFarmerCode(value);
    setGenerated(false);
    setError("");

    const matchedFarmer = farmers.find(
      (farmer) =>
        getFarmerCode(farmer).toLowerCase() === value.trim().toLowerCase()
    );

    setFarmerName(matchedFarmer ? getFarmerName(matchedFarmer) : "");
  };

  // Enter on From Date moves to To Date.
  const handleFromDateKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      toDateRef.current?.focus();
    }
  };

  // Enter on To Date moves directly to Farmer Selection.
  const handleToDateKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      farmerCodeRef.current?.focus();
    }
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    setError("");
    setGenerated(false);

    if (!fromDate || !toDate || !currentDate || !farmerCode.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (loadingFarmers) {
      setError("Please wait while farmer records are loading.");
      return;
    }

    const matchedFarmer = farmers.find(
      (farmer) =>
        getFarmerCode(farmer).toLowerCase() ===
        farmerCode.trim().toLowerCase()
    );

    if (!matchedFarmer) {
      setFarmerName("");
      setError("Farmer code not found. Please enter a valid farmer code.");
      farmerCodeRef.current?.focus();
      return;
    }

    const matchedName = getFarmerName(matchedFarmer);

    if (!matchedName) {
      setError(
        "Farmer code was found, but the farmer name could not be read. Please check the Farmer model field names."
      );
      return;
    }

    setFarmerName(matchedName);

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
                onKeyDown={handleFromDateKeyDown}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="toDate">
                <span className="field-icon">▦</span> To Date
              </label>
              <input
                ref={toDateRef}
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
                onKeyDown={handleToDateKeyDown}
                required
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
                required
              />
            </div>
          </section>

          <section className="input-panel farmer-panel">
            <div className="field">
              <label htmlFor="farmerCode">
                <span className="field-icon">♙</span> Farmer Selection
              </label>

              <input
                ref={farmerCodeRef}
                id="farmerCode"
                type="text"
                placeholder={
                  loadingFarmers ? "Loading farmers..." : "Enter Code"
                }
                value={farmerCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div className="field farmer-name-field">
              <label htmlFor="farmerName" className="farmer-label">
                <span className="field-icon">♙</span> Farmer Name
              </label>

              <input
                id="farmerName"
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
              Farmer details are loaded from your database. Milk quantities,
              rates, and total amounts will appear here once the collection
              records are connected.
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