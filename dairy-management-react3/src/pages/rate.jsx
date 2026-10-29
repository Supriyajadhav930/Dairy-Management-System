
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

  // Multiple saved charts, indexed by date.
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
  // SAVE MULTIPLE CHARTS LOCALLY
  // =====================================================

  const persistSavedCharts = (charts) => {
    localStorage.setItem("rateChartsByDate", JSON.stringify(charts));
    setSavedCharts(charts);
  };

  // =====================================================
  // LOAD SAVED CHARTS
  // =====================================================

  useEffect(() => {
    try {
      const savedChartsData = localStorage.getItem("rateChartsByDate");
      const savedRateChart = localStorage.getItem("rateChart");
      const savedDate = localStorage.getItem("rateChartDate");
      const savedSnfValues = localStorage.getItem("rateChartSnfValues");

      let charts = savedChartsData ? JSON.parse(savedChartsData) : {};

      if (!charts || typeof charts !== "object" || Array.isArray(charts)) {
        charts = {};
      }

      // Migrate an existing single saved chart without deleting it.
      if (savedRateChart && savedDate && !charts[savedDate]) {
        const parsedData = JSON.parse(savedRateChart);

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          let columns = savedSnfValues
            ? JSON.parse(savedSnfValues)
            : [];

          if (!Array.isArray(columns) || columns.length === 0) {
            if (
              parsedData[0].rates &&
              typeof parsedData[0].rates === "object"
            ) {
              columns = [
                ...new Set(
                  parsedData.flatMap((row) =>
                    Object.keys(row.rates || {})
                  )
                ),
              ].sort((a, b) => Number(a) - Number(b));
            } else {
              columns = [
                ...new Set(
                  parsedData.map((item) =>
                    Number(item.snf).toFixed(1)
                  )
                ),
              ].sort((a, b) => Number(a) - Number(b));
            }
          }

          let rows = parsedData;

          // Convert older flat chart data into matrix format.
          if (
            !parsedData[0].rates ||
            typeof parsedData[0].rates !== "object"
          ) {
            const fatValues = [
              ...new Set(
                parsedData.map((item) =>
                  Number(item.fat).toFixed(1)
                )
              ),
            ].sort((a, b) => Number(a) - Number(b));

            rows = fatValues.map((fat) => {
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
          }

          charts[savedDate] = {
            rateData: rows,
            snfValues: columns,
          };
        }
      }

      setSavedCharts(charts);

      // Keep the existing single-chart display compatible.
      // Do not automatically load the chart after Save has cleared it.
      if (savedRateChart && !savedChartsData) {
        const parsedData = JSON.parse(savedRateChart);

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          let columns = savedSnfValues
            ? JSON.parse(savedSnfValues)
            : [];

          let rows = parsedData;

          if (
            parsedData[0].rates &&
            typeof parsedData[0].rates === "object"
          ) {
            if (!Array.isArray(columns) || columns.length === 0) {
              columns = [
                ...new Set(
                  parsedData.flatMap((row) =>
                    Object.keys(row.rates || {})
                  )
                ),
              ].sort((a, b) => Number(a) - Number(b));
            }
          } else {
            columns = [
              ...new Set(
                parsedData.map((item) =>
                  Number(item.snf).toFixed(1)
                )
              ),
            ].sort((a, b) => Number(a) - Number(b));

            const fatValues = [
              ...new Set(
                parsedData.map((item) =>
                  Number(item.fat).toFixed(1)
                )
              ),
            ].sort((a, b) => Number(a) - Number(b));

            rows = fatValues.map((fat) => {
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
          }

          setRateData(rows);
          setSnfValues(columns);
        }
      }

      if (savedDate) {
        setDate(savedDate);
      }
    } catch (error) {
      console.error("Unable to load saved rate charts:", error);
      alert("The saved rate chart could not be loaded.");
    }
  }, []);

  // =====================================================
  // TOP SECTION KEYBOARD NAVIGATION
  // =====================================================

  const handleInputKeyDown = (e, nextRef = null, previousRef = null) => {
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
      const input = rateInputRefs.current[rowIndex]?.[columnIndex];

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
      (snf) => Number(firstRow.rates[snf]) - Number(firstRate)
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

  const handleRateKeyDown = (e, rowIndex, columnIndex) => {
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

        if (calculated && rowIndex < rateData.length - 1) {
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

    if (e.key === "Backspace" && e.currentTarget.value === "") {
      if (columnIndex > 0) {
        e.preventDefault();
        focusRateInput(rowIndex, columnIndex - 1);
      } else if (rowIndex > 0) {
        e.preventDefault();
        focusRateInput(rowIndex - 1, snfValues.length - 1);
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
          rateData: savedChart.rateData.map((row) => ({
            fat: String(row.fat),
            rates: row.rates,
          })),
          snfValues: savedChart.snfValues,
        },
      };

      // Keep the existing localStorage functionality.
      persistSavedCharts(updatedCharts);

      // Clear old single-chart storage to avoid restoring a stale chart.
      localStorage.removeItem("rateChart");
      localStorage.removeItem("rateChartSnfValues");
      localStorage.removeItem("rateChartDate");

      setSelectedSavedDate("");
      setRateData([]);
      setSnfValues([]);
      setSelectedRow(null);
      rateInputRefs.current = [];

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
    setSelectedSavedDate("");

    setFatFrom("");
    setFatTo("");
    setSnfFrom("");
    setSnfTo("");

    setRateData([]);
    setSnfValues([]);
    setSelectedRow(null);
    rateInputRefs.current = [];

    // Do not delete other saved charts.
    localStorage.removeItem("rateChart");
    localStorage.removeItem("rateChartSnfValues");
    localStorage.removeItem("rateChartDate");

    alert("Current rate chart cancelled!");
  };

  // =====================================================
  // UPDATE SELECTED CHART
  // =====================================================

  const updateRateChart = () => {
    if (rateData.length === 0) {
      alert("There is no rate chart to update.");
      return;
    }

    if (!date) {
      alert("Please select a date before updating.");
      return;
    }

    const updatedCharts = {
      ...savedCharts,
      [date]: {
        rateData: rateData.map((row) => ({
          ...row,
          rates: { ...row.rates },
        })),
        snfValues: [...snfValues],
      },
    };

    try {
      persistSavedCharts(updatedCharts);
      setSelectedSavedDate(date);
      alert("Rate chart updated successfully!");
    } catch (error) {
      console.error("Unable to update rate chart:", error);
      alert("Unable to update the rate chart.");
    }
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
    rateInputRefs.current = [];

    // Update the selected chart's saved copy too.
    if (selectedSavedDate && savedCharts[selectedSavedDate]) {
      const updatedCharts = {
        ...savedCharts,
        [selectedSavedDate]: {
          rateData: updatedData,
          snfValues: [...snfValues],
        },
      };

      persistSavedCharts(updatedCharts);
    }

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

    const isOneDecimalStep = (value) =>
      Math.abs(value * 10 - Math.round(value * 10)) < 0.000001;

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
      rates: Object.fromEntries(columns.map((snf) => [snf, ""])),
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
                handleInputKeyDown(e, snfFromRef, fatFromRef)
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
                      selectedRow === rowIndex ? "selected-row" : ""
                    }
                  >
                    <th className="fat-cell">{item.fat}</th>

                    {snfValues.map((snf, columnIndex) => (
                      <td key={snf}>
                        <input
                          ref={(element) => {
                            if (!rateInputRefs.current[rowIndex]) {
                              rateInputRefs.current[rowIndex] = [];
                            }

                            rateInputRefs.current[rowIndex][columnIndex] =
                              element;
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
                    ))}
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
              onChange={(e) => loadSavedChart(e.target.value)}
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
              <option value="">Select saved chart date</option>

              {Object.keys(savedCharts)
                .sort((a, b) => b.localeCompare(a))
                .map((savedDate) => (
                  <option key={savedDate} value={savedDate}>
                    {savedDate.split("-").reverse().join("/")}
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
