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

  const [rateData, setRateData] = useState([]);
  const [snfValues, setSnfValues] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);

  // Saved charts indexed by date.
  const [savedCharts, setSavedCharts] = useState({});
  const [selectedSavedDate, setSelectedSavedDate] = useState("");

  // =====================================================
  // INPUT REFERENCES
  // =====================================================

  const fatFromRef = useRef(null);
  const fatToRef = useRef(null);
  const snfFromRef = useRef(null);
  const snfToRef = useRef(null);
  const generateButtonRef = useRef(null);

  const rateInputRefs = useRef([]);

  // =====================================================
  // UPDATE SAVED CHARTS STATE AND CACHE
  // =====================================================

  const persistSavedCharts = (charts) => {
    setSavedCharts(charts);

    try {
      localStorage.setItem(
        "rateChartsByDate",
        JSON.stringify(charts)
      );
    } catch (error) {
      console.error("Unable to update local cache:", error);
    }
  };

  // =====================================================
  // LOAD SAVED CHARTS FROM MONGODB
  // MongoDB is the source of truth.
  // =====================================================

  useEffect(() => {
    const loadChartsFromDatabase = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/ratecharts"
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load rate charts."
          );
        }

        const charts = {};

        result.forEach((chart) => {
          charts[chart.date] = {
            rateData: (chart.rateData || []).map((row) => ({
              fat: String(row.fat),
              rates: row.rates || {},
            })),
            snfValues: (chart.snfValues || []).map(String),
          };
        });

        persistSavedCharts(charts);
      } catch (error) {
        console.error("Error loading rate charts:", error);

        alert(
          `Unable to load rate charts: ${error.message}`
        );
      }
    };

    loadChartsFromDatabase();
  }, []);

  // =====================================================
  // CLEAR CURRENT GRID
  // =====================================================

  const clearGrid = () => {
    setRateData([]);
    setSnfValues([]);
    setSelectedRow(null);
    setSelectedSavedDate("");
    rateInputRefs.current = [];
  };

  // =====================================================
  // CLEAR LEGACY LOCAL STORAGE
  // =====================================================

  const clearLegacyStorage = () => {
    localStorage.removeItem("rateChart");
    localStorage.removeItem("rateChartSnfValues");
    localStorage.removeItem("rateChartDate");
  };

  // =====================================================
  // TOP SECTION KEYBOARD NAVIGATION
  // =====================================================

  const handleInputKeyDown = (
    e,
    nextRef = null,
    previousRef = null
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (e.shiftKey) {
        previousRef?.current?.focus();
        return;
      }

      nextRef?.current?.focus();
      return;
    }

    if (
      e.key === "Backspace" &&
      e.currentTarget.value === "" &&
      previousRef?.current
    ) {
      e.preventDefault();
      previousRef.current.focus();
    }
  };

  // =====================================================
  // FOCUS RATE INPUT
  // =====================================================

  const focusRateInput = (rowIndex, columnIndex) => {
    requestAnimationFrame(() => {
      const input =
        rateInputRefs.current[rowIndex]?.[columnIndex];

      if (input) {
        input.focus();
        input.select();
      }
    });
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
  // FIRST ROW RATE DIFFERENCES
  // =====================================================

  const getFirstRowDifferences = () => {
    if (rateData.length === 0 || snfValues.length === 0) {
      return null;
    }

    const firstRow = rateData[0];
    const firstRate = firstRow.rates[snfValues[0]];

    const allRatesEntered = snfValues.every((snf) => {
      const value = firstRow.rates[snf];

      return (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        Number.isFinite(Number(value))
      );
    });

    if (
      !allRatesEntered ||
      firstRate === "" ||
      !Number.isFinite(Number(firstRate))
    ) {
      return null;
    }

    return snfValues.map(
      (snf) =>
        Number(firstRow.rates[snf]) - Number(firstRate)
    );
  };

  // =====================================================
  // AUTOMATIC RATE CALCULATION
  // =====================================================

  const calculateRowRates = (rowIndex, startingRate) => {
    const differences = getFirstRowDifferences();

    if (!differences) {
      alert(
        "Please complete all rates in the first row before calculating the next row."
      );

      return false;
    }

    if (
      startingRate === "" ||
      !Number.isFinite(Number(startingRate))
    ) {
      return false;
    }

    const start = Number(startingRate);
    const calculatedRates = {};

    snfValues.forEach((snf, columnIndex) => {
      calculatedRates[snf] = Number(
        (start + differences[columnIndex]).toFixed(2)
      ).toString();
    });

    setRateData((previousData) =>
      previousData.map((row, index) =>
        index === rowIndex
          ? { ...row, rates: calculatedRates }
          : row
      )
    );

    return true;
  };

  // =====================================================
  // RATE INPUT KEYBOARD NAVIGATION
  // =====================================================

  const handleRateKeyDown = (
    e,
    rowIndex,
    columnIndex
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (rowIndex === 0) {
        if (columnIndex < snfValues.length - 1) {
          focusRateInput(rowIndex, columnIndex + 1);
        } else if (rateData.length > 1) {
          focusRateInput(1, 0);
        }

        return;
      }

      if (columnIndex === 0) {
        const calculated = calculateRowRates(
          rowIndex,
          e.currentTarget.value
        );

        if (
          calculated &&
          rowIndex < rateData.length - 1
        ) {
          focusRateInput(rowIndex + 1, 0);
        }

        return;
      }

      if (columnIndex < snfValues.length - 1) {
        focusRateInput(rowIndex, columnIndex + 1);
      } else if (rowIndex < rateData.length - 1) {
        focusRateInput(rowIndex + 1, 0);
      }

      return;
    }

    if (
      e.key === "Backspace" &&
      e.currentTarget.value === ""
    ) {
      if (columnIndex > 0) {
        e.preventDefault();
        focusRateInput(rowIndex, columnIndex - 1);
      } else if (rowIndex > 0) {
        e.preventDefault();
        focusRateInput(
          rowIndex - 1,
          snfValues.length - 1
        );
      }
    }
  };

  // =====================================================
  // LOAD CHART FOR A SELECTED DATE
  // =====================================================

  const loadSavedChart = (savedDate) => {
    setSelectedSavedDate(savedDate);

    if (!savedDate) {
      setDate(getTodayDate());
      setRateData([]);
      setSnfValues([]);
      setSelectedRow(null);
      rateInputRefs.current = [];
      return;
    }

    const chart = savedCharts[savedDate];

    if (!chart) {
      return;
    }

    setDate(savedDate);
    setRateData(chart.rateData);
    setSnfValues(chart.snfValues);
    setSelectedRow(null);
    rateInputRefs.current = [];
  };

  // =====================================================
  // SAVE RATE CHART TO MONGODB
  // =====================================================

  const saveRateChart = async () => {
    if (rateData.length === 0) {
      alert("Please generate the rate chart first.");
      return;
    }

    if (!date) {
      alert("Please select a date before saving.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/ratecharts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date,
            rateData: rateData.map((row) => ({
              fat: Number(row.fat),
              rates: row.rates,
            })),
            snfValues,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to save rate chart."
        );
      }

      const savedChart = result.data;

      const updatedCharts = {
        ...savedCharts,
        [savedChart.date]: {
          rateData: (savedChart.rateData || []).map((row) => ({
            fat: String(row.fat),
            rates: row.rates || {},
          })),
          snfValues: (savedChart.snfValues || []).map(String),
        },
      };

      persistSavedCharts(updatedCharts);
      clearLegacyStorage();

      // Clear the grid only after MongoDB confirms success.
      clearGrid();

      alert("Rate chart saved successfully to MongoDB!");
    } catch (error) {
      console.error("Error saving rate chart:", error);

      alert(`Unable to save rate chart: ${error.message}`);
    }
  };

  // =====================================================
  // CANCEL CURRENT CHART
  // =====================================================

  const cancelRateChart = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel and clear the current rate chart?"
    );

    if (!confirmCancel) {
      return;
    }

    setDate(getTodayDate());

    setFatFrom("");
    setFatTo("");
    setSnfFrom("");
    setSnfTo("");

    clearGrid();
    clearLegacyStorage();

    alert("Current rate chart cancelled!");
  };

  // =====================================================
  // UPDATE SELECTED CHART IN MONGODB
  // Uses POST because the backend route upserts by date.
  // =====================================================

  const updateRateChart = async () => {
    if (rateData.length === 0) {
      alert("There is no rate chart to update.");
      return;
    }

    const chartDate = selectedSavedDate || date;

    if (!chartDate) {
      alert("Please select a date before updating.");
      return;
    }

    // Prevent Update from accidentally creating a new chart.
    if (!savedCharts[chartDate]) {
      alert(
        "Please select an existing saved chart from the date dropdown before updating."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/ratecharts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: chartDate,
            rateData: rateData.map((row) => ({
              fat: Number(row.fat),
              rates: row.rates,
            })),
            snfValues,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update rate chart."
        );
      }

      const savedChart = result.data;

      const updatedCharts = {
        ...savedCharts,
        [savedChart.date]: {
          rateData: (savedChart.rateData || []).map((row) => ({
            fat: String(row.fat),
            rates: row.rates || {},
          })),
          snfValues: (savedChart.snfValues || []).map(String),
        },
      };

      persistSavedCharts(updatedCharts);
      clearLegacyStorage();

      // Clear the grid only after MongoDB confirms success.
      clearGrid();

      alert("Rate chart updated successfully in MongoDB!");
    } catch (error) {
      console.error("Error updating rate chart:", error);

      alert(`Unable to update rate chart: ${error.message}`);
    }
  };

  // =====================================================
  // DELETE ENTIRE SAVED CHART FROM MONGODB
  // =====================================================

  const deleteRateChart = async () => {
    const chartDate =
      selectedSavedDate ||
      (savedCharts[date] ? date : "");

    if (!chartDate || !savedCharts[chartDate]) {
      alert("Please select a saved rate chart date to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the entire rate chart for ${chartDate}? This cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/ratecharts/${encodeURIComponent(
          chartDate
        )}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete rate chart."
        );
      }

      const updatedCharts = { ...savedCharts };
      delete updatedCharts[chartDate];

      persistSavedCharts(updatedCharts);
      clearLegacyStorage();

      // Clear the grid only after MongoDB confirms deletion.
      setDate(getTodayDate());
      clearGrid();

      alert("Rate chart deleted successfully from MongoDB!");
    } catch (error) {
      console.error("Error deleting rate chart:", error);

      alert(`Unable to delete rate chart: ${error.message}`);
    }
  };

  // =====================================================
  // GENERATE RATE CHART MATRIX
  // =====================================================

  const generateRateChart = () => {
    const fatStart = Number(fatFrom);
    const fatEnd = Number(fatTo);
    const snfStart = Number(snfFrom);
    const snfEnd = Number(snfTo);

    const inputs = [
      fatFrom,
      fatTo,
      snfFrom,
      snfTo,
    ];

    const hasEmptyInput = inputs.some(
      (value) => value.trim() === ""
    );

    const isOneDecimalStep = (value) =>
      Math.abs(value * 10 - Math.round(value * 10)) <
      0.000001;

    if (
      !date ||
      hasEmptyInput ||
      !Number.isFinite(fatStart) ||
      !Number.isFinite(fatEnd) ||
      !Number.isFinite(snfStart) ||
      !Number.isFinite(snfEnd) ||
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

    const data = fatValues.map((fat) => ({
      fat,
      rates: Object.fromEntries(
        columns.map((snf) => [snf, ""])
      ),
    }));

    setSnfValues(columns);
    setRateData(data);
    setSelectedRow(null);
    setSelectedSavedDate("");
    rateInputRefs.current = [];
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="rate-page">
      <h1 className="page-title">Rate Chart</h1>

      <div className="top-section">
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
                handleInputKeyDown(
                  e,
                  snfFromRef,
                  fatFromRef
                )
              }
            />
          </div>
        </div>

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
                handleInputKeyDown(
                  e,
                  snfToRef,
                  fatToRef
                )
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
                handleInputKeyDown(
                  e,
                  generateButtonRef,
                  snfFromRef
                )
              }
            />
          </div>
        </div>

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
                      selectedRow === rowIndex
                        ? "selected-row"
                        : ""
                    }
                  >
                    <th className="fat-cell">
                      {item.fat}
                    </th>

                    {snfValues.map(
                      (snf, columnIndex) => (
                        <td key={snf}>
                          <input
                            ref={(element) => {
                              if (
                                !rateInputRefs.current[rowIndex]
                              ) {
                                rateInputRefs.current[rowIndex] =
                                  [];
                              }

                              rateInputRefs.current[rowIndex][
                                columnIndex
                              ] = element;
                            }}
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
                            onKeyDown={(e) =>
                              handleRateKeyDown(
                                e,
                                rowIndex,
                                columnIndex
                              )
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRow(rowIndex);
                            }}
                          />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="bottom-section">
        <div className="bottom-date">
          <div className="bottom-date-label">
            <img src={dateIcon} alt="Date" />
            <span>Date</span>
          </div>

          <div className="bottom-date-input">
            <select
              value={selectedSavedDate}
              onChange={(e) =>
                loadSavedChart(e.target.value)
              }
              aria-label="Select a saved rate chart date"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#303838",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <option value="">
                Select saved chart date
              </option>

              {Object.keys(savedCharts)
                .sort((a, b) => b.localeCompare(a))
                .map((savedDate) => (
                  <option
                    key={savedDate}
                    value={savedDate}
                  >
                    {savedDate
                      .split("-")
                      .reverse()
                      .join("/")}
                  </option>
                ))}
            </select>
          </div>
        </div>

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