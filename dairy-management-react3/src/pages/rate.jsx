
import { useState, useEffect, useRef } from "react";
import "./rate.css";

import dateIcon from "../assets/Rate/date.png";
import fatIcon from "../assets/Rate/fat.png";
import snfIcon from "../assets/Rate/SNF.png";
import generateIcon from "../assets/Rate/generate.png";
import rateChartIcon from "../assets/Rate/rate_chart.png";
import updateIcon from "../assets/Rate/update.png";
import deleteIcon from "../assets/Rate/delete.png";
import cancelIcon from "../assets/Rate/cancel.png";
import saveIcon from "../assets/Rate/save.png";

function Rate() {
  // =====================================================
  // GET TODAY'S DATE
  // =====================================================

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // STATES
  // =====================================================

  const [date, setDate] = useState(getTodayDate());

  const [fatFrom, setFatFrom] = useState("");
  const [fatTo, setFatTo] = useState("");

  const [snfFrom, setSnfFrom] = useState("");
  const [snfTo, setSnfTo] = useState("");

  // Each row contains one FAT value and a rates object.
  // Example: { fat: "2.5", rates: { "7.5": "0.00" } }
  const [rateData, setRateData] = useState([]);
  const [snfValues, setSnfValues] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);

  // =====================================================
  // INPUT REFERENCES
  // =====================================================

  const fatFromRef = useRef(null);
  const fatToRef = useRef(null);
  const snfFromRef = useRef(null);
  const snfToRef = useRef(null);
  const generateButtonRef = useRef(null);

  // =====================================================
  // SAVE MATRIX TO LOCAL STORAGE
  // =====================================================

  const persistRateChart = (data, columns, chartDate) => {
    localStorage.setItem("rateChart", JSON.stringify(data));
    localStorage.setItem("rateChartSnfValues", JSON.stringify(columns));
    localStorage.setItem("rateChartDate", chartDate);
  };

  // =====================================================
  // LOAD SAVED RATE CHART
  // =====================================================

  useEffect(() => {
    try {
      const savedRateChart = localStorage.getItem("rateChart");
      const savedDate = localStorage.getItem("rateChartDate");
      const savedSnfValues = localStorage.getItem("rateChartSnfValues");

      if (savedRateChart) {
        const parsedData = JSON.parse(savedRateChart);

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          // New matrix format
          if (parsedData[0].rates && typeof parsedData[0].rates === "object") {
            let columns = savedSnfValues
              ? JSON.parse(savedSnfValues)
              : [];

            // Recover SNF columns from the saved rows if necessary.
            if (!Array.isArray(columns) || columns.length === 0) {
              columns = [
                ...new Set(
                  parsedData.flatMap((row) => Object.keys(row.rates || {}))
                ),
              ].sort((a, b) => Number(a) - Number(b));
            }

            setRateData(parsedData);
            setSnfValues(columns);
          } else {
            // Convert an older flat chart into a matrix.
            const columns = [
              ...new Set(parsedData.map((item) => Number(item.snf).toFixed(1))),
            ].sort((a, b) => Number(a) - Number(b));

            const fatValues = [
              ...new Set(parsedData.map((item) => Number(item.fat).toFixed(1))),
            ].sort((a, b) => Number(a) - Number(b));

            const convertedData = fatValues.map((fat) => {
              const rates = {};

              columns.forEach((snf) => {
                const oldItem = parsedData.find(
                  (item) =>
                    Number(item.fat).toFixed(1) === fat &&
                    Number(item.snf).toFixed(1) === snf
                );

               rates[snf] = oldItem?.rate ?? ""; 
              });

              return { fat, rates };
            });

            setRateData(convertedData);
            setSnfValues(columns);
          }
        } else {
          setRateData([]);
          setSnfValues([]);
        }
      }

      if (savedDate) {
        setDate(savedDate);
      }
    } catch (error) {
      console.error("Unable to load saved rate chart:", error);
      alert("The saved rate chart could not be loaded.");
    }
  }, []);

  // =====================================================
  // KEYBOARD NAVIGATION
  // =====================================================

  const handleInputKeyDown = (e, nextRef = null, previousRef = null) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (e.shiftKey) {
        if (previousRef?.current) {
          previousRef.current.focus();
        }
        return;
      }

      if (nextRef?.current) {
        nextRef.current.focus();
      }

      return;
    }

    if (e.key === "Backspace" && e.currentTarget.value === "") {
      if (previousRef?.current) {
        e.preventDefault();
        previousRef.current.focus();
      }
    }
  };

  // =====================================================
  // SAVE RATE CHART
  // =====================================================

  const saveRateChart = () => {
    if (rateData.length === 0) {
      alert("Please generate the rate chart first.");
      return;
    }

    persistRateChart(rateData, snfValues, date);
    alert("Rate chart saved successfully!");
  };

  // =====================================================
  // CANCEL WHOLE RATE CHART
  // =====================================================

  const cancelRateChart = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel and clear the rate chart?"
    );

    if (!confirmCancel) {
      return;
    }

    setDate(getTodayDate());

    setFatFrom("");
    setFatTo("");
    setSnfFrom("");
    setSnfTo("");

    setRateData([]);
    setSnfValues([]);
    setSelectedRow(null);

    localStorage.removeItem("rateChart");
    localStorage.removeItem("rateChartSnfValues");
    localStorage.removeItem("rateChartDate");

    alert("Rate chart cancelled!");
  };

  // =====================================================
  // UPDATE RATE CHART
  // =====================================================

  const updateRateChart = () => {
    if (rateData.length === 0) {
      alert("There is no rate chart to update.");
      return;
    }

    persistRateChart(rateData, snfValues, date);
    alert("Rate chart updated successfully!");
  };

  // =====================================================
  // DELETE SELECTED FAT ROW
  // =====================================================

  const deleteRateChart = () => {
    if (rateData.length === 0) {
      alert("There is no rate chart to delete.");
      return;
    }

    if (selectedRow === null) {
      alert("Please select a FAT row to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected FAT row?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedData = rateData.filter(
      (_, index) => index !== selectedRow
    );

    setRateData(updatedData);
    setSelectedRow(null);

    persistRateChart(updatedData, snfValues, date);

    alert("Selected FAT row deleted successfully!");
  };

  // =====================================================
  // GENERATE RATE CHART MATRIX
  // =====================================================

  const generateRateChart = () => {
    const fatStart = Number(fatFrom);
    const fatEnd = Number(fatTo);
    const snfStart = Number(snfFrom);
    const snfEnd = Number(snfTo);

    const inputs = [fatFrom, fatTo, snfFrom, snfTo];

    const hasEmptyInput = inputs.some(
      (value) => value.trim() === ""
    );

    const isValidNumber = (value) => Number.isFinite(value);

    const isOneDecimalStep = (value) =>
      Math.abs(value * 10 - Math.round(value * 10)) < 0.000001;

    if (
      !date ||
      hasEmptyInput ||
      !isValidNumber(fatStart) ||
      !isValidNumber(fatEnd) ||
      !isValidNumber(snfStart) ||
      !isValidNumber(snfEnd) ||
      fatStart < 0 ||
      snfStart < 0 ||
      fatStart > fatEnd ||
      snfStart > snfEnd ||
      !isOneDecimalStep(fatStart) ||
      !isOneDecimalStep(fatEnd) ||
      !isOneDecimalStep(snfStart) ||
      !isOneDecimalStep(snfEnd)
    ) {
      alert(
        "Please enter a date and valid FAT/SNF ranges using 0.1 increments."
      );
      return;
    }

    // Integer tenths prevent floating-point errors.
    const fatValues = [];
    const columns = [];

    for (
      let value = Math.round(fatStart * 10);
      value <= Math.round(fatEnd * 10);
      value++
    ) {
      fatValues.push((value / 10).toFixed(1));
    }

    for (
      let value = Math.round(snfStart * 10);
      value <= Math.round(snfEnd * 10);
      value++
    ) {
      columns.push((value / 10).toFixed(1));
    }

    // Each FAT row contains one rate cell for each SNF value.
    const data = fatValues.map((fat) => ({
      fat,
      rates: Object.fromEntries(
        columns.map((snf) => [snf, ""])
      ),
    }));

    setSnfValues(columns);
    setRateData(data);
    setSelectedRow(null);
  };

  // =====================================================
  // UPDATE INDIVIDUAL RATE CELL
  // =====================================================

  const updateRateValue = (rowIndex, snf, value) => {
    setRateData((previousData) =>
      previousData.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              rates: {
                ...row.rates,
                [snf]: value,
              },
            }
          : row
      )
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="rate-page">
      {/* TITLE */}
      <h1 className="page-title">Rate Chart</h1>

      {/* TOP SECTION */}
      <div className="top-section">
        {/* DATE */}
        <div className="input-card">
          <div className="field-title">
            <img src={dateIcon} alt="Date" />
            <span>Date</span>
          </div>

          <div className="date-input-wrapper">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* FAT */}
        <div className="input-card">
          <div className="field-title">
            <img src={fatIcon} alt="FAT" />
            <span>FAT (%)</span>
          </div>

          <div className="range-labels">
            <span>From</span>
            <span>To</span>
          </div>

          <div className="range-inputs">
            <input
              ref={fatFromRef}
              type="number"
              placeholder="0.00"
              min="0"
              step="0.1"
              value={fatFrom}
              onChange={(e) => setFatFrom(e.target.value)}
              onKeyDown={(e) =>
                handleInputKeyDown(e, fatToRef, null)
              }
            />

            <input
              ref={fatToRef}
              type="number"
              placeholder="0.00"
              min="0"
              step="0.1"
              value={fatTo}
              onChange={(e) => setFatTo(e.target.value)}
              onKeyDown={(e) =>
                handleInputKeyDown(e, snfFromRef, fatFromRef)
              }
            />
          </div>
        </div>

        {/* SNF */}
        <div className="input-card">
          <div className="field-title">
            <img src={snfIcon} alt="SNF" />
            <span>SNF (%)</span>
          </div>

          <div className="range-labels">
            <span>From</span>
            <span>To</span>
          </div>

          <div className="range-inputs">
            <input
              ref={snfFromRef}
              type="number"
              placeholder="0.00"
              min="0"
              step="0.1"
              value={snfFrom}
              onChange={(e) => setSnfFrom(e.target.value)}
              onKeyDown={(e) =>
                handleInputKeyDown(e, snfToRef, fatToRef)
              }
            />

            <input
              ref={snfToRef}
              type="number"
              placeholder="0.00"
              min="0"
              step="0.1"
              value={snfTo}
              onChange={(e) => setSnfTo(e.target.value)}
              onKeyDown={(e) =>
                handleInputKeyDown(e, generateButtonRef, snfFromRef)
              }
            />
          </div>
        </div>

        {/* GENERATE */}
        <div className="generate-card">
          <button
            ref={generateButtonRef}
            type="button"
            className="generate-button"
            onClick={generateRateChart}
          >
            <img src={generateIcon} alt="Generate" />
            <span>Generate</span>
          </button>
        </div>
      </div>

      {/* RATE CHART */}
      <div className="chart-section">
        <div className="chart-heading">
          <img src={rateChartIcon} alt="Rate Chart" />
          <span>Rate Chart</span>
        </div>

        <div className="chart-content">
          {rateData.length > 0 && snfValues.length > 0 && (
            <table className="rate-table">
              <thead>
                <tr>
                  <th className="fat-heading">FAT (%)</th>

                  {snfValues.map((snf) => (
                    <th className="snf-heading" key={snf}>
                      {snf}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rateData.map((item, rowIndex) => (
                  <tr
                    key={item.fat}
                    onClick={() => setSelectedRow(rowIndex)}
                    className={
                      selectedRow === rowIndex ? "selected-row" : ""
                    }
                  >
                    <th className="fat-cell">{item.fat}</th>

                    {snfValues.map((snf) => (
                      <td key={snf}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rates[snf] ?? ""}
                          aria-label={`Rate for FAT ${item.fat}, SNF ${snf}`}
                          onChange={(e) =>
                            updateRateValue(
                              rowIndex,
                              snf,
                              e.target.value
                            )
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRow(rowIndex);
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="bottom-section">
        {/* BOTTOM DATE */}
        <div className="bottom-date">
          <div className="bottom-date-label">
            <img src={dateIcon} alt="Date" />
            <span>Date</span>
          </div>

          <div className="bottom-date-input">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-buttons">
          <button
            type="button"
            className="action-button"
            onClick={updateRateChart}
          >
            <img src={updateIcon} alt="Update" />
            <span>Update</span>
          </button>

          <button
            type="button"
            className="action-button"
            onClick={deleteRateChart}
          >
            <img src={deleteIcon} alt="Delete" />
            <span>Delete</span>
          </button>

          <button
            type="button"
            className="action-button"
            onClick={cancelRateChart}
          >
            <img src={cancelIcon} alt="Cancel" />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            className="action-button"
            onClick={saveRateChart}
          >
            <img src={saveIcon} alt="Save" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Rate;
