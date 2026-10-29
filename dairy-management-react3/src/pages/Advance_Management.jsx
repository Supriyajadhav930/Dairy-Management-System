
import React, { useEffect, useState } from "react";
import "./Advance_Management.css";

const initialRecords = [
  {
    id: 1,
    farmer: "Sample Farmer",
    type: "advance",
    amount: 25000,
    date: "2026-10-29",
    note: "Initial advance",
  },
  {
    id: 2,
    farmer: "Sample Farmer",
    type: "reduction",
    amount: 8000,
    date: "2026-10-29",
    note: "Advance reduction",
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function Icon({ name, size = 24 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    farmers: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    money: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M7 9h.01M17 15h.01" />
      </>
    ),
    outstanding: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 9h10M7 13h6M7 16h4" />
      </>
    ),
    reduction: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    close: (
      <>
        <path d="m18 6-12 12M6 6l12 12" />
      </>
    ),
  };

  return <svg {...common}>{icons[name] || null}</svg>;
}

function Advance_Management() {
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem("advance-management-records");
      return saved ? JSON.parse(saved) : initialRecords;
    } catch {
      return initialRecords;
    }
  });

  const [modalType, setModalType] = useState(null);
  const [farmer, setFarmer] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "advance-management-records",
      JSON.stringify(records)
    );
  }, [records]);

  const totalAdvances = records
    .filter((record) => record.type === "advance")
    .reduce((total, record) => total + Number(record.amount), 0);

  const totalReduced = records
    .filter((record) => record.type === "reduction")
    .reduce((total, record) => total + Number(record.amount), 0);

  const outstanding = totalAdvances - totalReduced;

  const totalFarmers = new Set(
    records.map((record) => record.farmer.trim().toLowerCase())
  ).size;

  const openModal = (type) => {
    setModalType(type);
    setFarmer("");
    setAmount("");
    setDate(new Date().toLocaleDateString("en-CA"));
    setNote("");
    setError("");
  };

  const closeModal = () => {
    setModalType(null);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!farmer.trim()) {
      setError("Please enter the farmer name.");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (modalType === "reduction" && numericAmount > outstanding) {
      setError("Reduction amount cannot exceed the total outstanding.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      farmer: farmer.trim(),
      type: modalType,
      amount: numericAmount,
      date,
      note: note.trim(),
    };

    setRecords((previous) => [...previous, newRecord]);
    closeModal();
  };

  return (
    <main className="am-page">
      <div className="am-container">
        <header className="am-header">
          <div className="am-brand">
            <div className="am-logo">
              <Icon name="money" size={29} />
            </div>

            <div>
              <h1>Advance Management</h1>
              <p>Manage farmer advances and reductions</p>
            </div>
          </div>

          <div className="am-header-label">
            <span className="am-status-dot" />
            Management Dashboard
          </div>
        </header>

        <section className="am-welcome">
          <div>
            <p className="am-eyebrow">OVERVIEW</p>
            <h2>Advance Overview</h2>
            <p className="am-subtitle">
              Track advances, reductions, and outstanding balances.
            </p>
          </div>

          <div className="am-date-label">
            <Icon name="calendar" size={17} />
            <span>
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </section>

        <section className="am-stats-grid">
          <article className="am-stat-card">
            <div className="am-stat-top">
              <div className="am-stat-icon">
                <Icon name="farmers" size={24} />
              </div>
              <span className="am-stat-caption">Farmers</span>
            </div>
            <p className="am-stat-value">{totalFarmers}</p>
            <p className="am-stat-description">Total registered farmers</p>
          </article>

          <article className="am-stat-card">
            <div className="am-stat-top">
              <div className="am-stat-icon">
                <Icon name="money" size={24} />
              </div>
              <span className="am-stat-caption">Advances</span>
            </div>
            <p className="am-stat-value">
              {formatCurrency(totalAdvances)}
            </p>
            <p className="am-stat-description">Total advances issued</p>
          </article>

          <article className="am-stat-card">
            <div className="am-stat-top">
              <div className="am-stat-icon">
                <Icon name="outstanding" size={24} />
              </div>
              <span className="am-stat-caption">Outstanding</span>
            </div>
            <p className="am-stat-value">
              {formatCurrency(outstanding)}
            </p>
            <p className="am-stat-description">Remaining balance</p>
          </article>

          <article className="am-stat-card">
            <div className="am-stat-top">
              <div className="am-stat-icon">
                <Icon name="reduction" size={24} />
              </div>
              <span className="am-stat-caption">Reduced</span>
            </div>
            <p className="am-stat-value">
              {formatCurrency(totalReduced)}
            </p>
            <p className="am-stat-description">Total reductions recorded</p>
          </article>
        </section>

        <section className="am-actions-section">
          <div className="am-section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Choose an action to manage farmer advances.</p>
            </div>
          </div>

          <div className="am-action-grid">
            <button
              type="button"
              className="am-action-btn"
              onClick={() => openModal("advance")}
            >
              <span className="am-action-icon">
                <Icon name="plus" size={23} />
              </span>

              <span className="am-action-text">
                <strong>Add Advance Entry</strong>
                <small>Record a new farmer advance</small>
              </span>
            </button>

            <button
              type="button"
              className="am-action-btn"
              onClick={() => openModal("reduction")}
            >
              <span className="am-action-icon am-reduction-icon">
                <Icon name="reduction" size={23} />
              </span>

              <span className="am-action-text">
                <strong>Advance Reduction</strong>
                <small>Record an advance repayment</small>
              </span>
            </button>
          </div>
        </section>
      </div>

      {modalType && (
        <div
          className="am-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="am-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="am-modal-title"
          >
            <div className="am-modal-header">
              <div className="am-modal-title-icon">
                <Icon
                  name={modalType === "advance" ? "plus" : "reduction"}
                  size={23}
                />
              </div>

              <div className="am-modal-heading">
                <h2 id="am-modal-title">
                  {modalType === "advance"
                    ? "Add Advance Entry"
                    : "Advance Reduction"}
                </h2>
                <p>
                  {modalType === "advance"
                    ? "Enter the details of the new advance."
                    : "Enter the details of the advance reduction."}
                </p>
              </div>

              <button
                type="button"
                className="am-close-btn"
                onClick={closeModal}
                aria-label="Close form"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form className="am-form" onSubmit={handleSubmit}>
              <label htmlFor="am-farmer">Farmer Name</label>
              <input
                id="am-farmer"
                type="text"
                placeholder="Enter farmer name"
                value={farmer}
                onChange={(event) => setFarmer(event.target.value)}
                required
              />

              <label htmlFor="am-amount">Amount (₹)</label>
              <input
                id="am-amount"
                type="number"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />

              <label htmlFor="am-date">Date</label>
              <input
                id="am-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />

              <label htmlFor="am-note">Note (Optional)</label>
              <textarea
                id="am-note"
                placeholder="Add a note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows="3"
              />

              {error && <p className="am-form-error">{error}</p>}

              <div className="am-form-actions">
                <button
                  type="button"
                  className="am-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="am-submit-btn">
                  {modalType === "advance"
                    ? "Save Advance"
                    : "Save Reduction"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default Advance_Management;
