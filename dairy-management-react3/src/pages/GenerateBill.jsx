
import { useEffect, useState } from "react";
import "./GenerateBill.css";

import calendarIcon from "../assets/Generate Bill/calendar.jpg";
import userIcon from "../assets/Generate Bill/user.jpg";
import arrowLeftIcon from "../assets/Generate Bill/arrow-left.jpg";
import arrowRightIcon from "../assets/Generate Bill/arrow-right.jpg";
import chevronsLeftIcon from "../assets/Generate Bill/chevrons-left.jpg";
import chevronsRightIcon from "../assets/Generate Bill/chevrons-right.jpg";
import billIcon from "../assets/Generate Bill/bill.jpg";

const COLLECTION_API = "http://localhost:5000/api/collections";

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function getFarmerCode(farmer) {
  return String(
    farmer.farmerCode ??
      farmer.farmer_code ??
      farmer.code ??
      farmer.farmer?.code ??
      ""
  );
}

function getFarmerName(farmer) {
  return String(
    farmer.farmerName ??
      farmer.farmer_name ??
      farmer.name ??
      farmer.farmer?.name ??
      ""
  );
}

export default function GenerateBill() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentDate] = useState(getToday);

  const [farmers, setFarmers] = useState([]);
  const [selectedFarmers, setSelectedFarmers] = useState([]);

  const [leftSelection, setLeftSelection] = useState([]);
  const [rightSelection, setRightSelection] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const fetchCollectionData = async () => {
      if (!fromDate || !toDate || fromDate > toDate) {
        setFarmers([]);
        setSelectedFarmers([]);
        setLeftSelection([]);
        setRightSelection([]);
        return;
      }

      try {
        const response = await fetch(
          `${COLLECTION_API}?type=both&from=${fromDate}&to=${toDate}`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch collection data");
        }

        const data = await response.json();

        const collectionList = Array.isArray(data)
          ? data
          : data.collections ?? data.data ?? [];

        const uniqueFarmers = new Map();

        collectionList.forEach((record) => {
          const code = getFarmerCode(record);
          const name = getFarmerName(record);

          if (code && name && !uniqueFarmers.has(code)) {
            uniqueFarmers.set(code, {
              ...record,
              code,
              name,
            });
          }
        });

        if (!cancelled) {
          setFarmers(Array.from(uniqueFarmers.values()));
          setSelectedFarmers([]);
          setLeftSelection([]);
          setRightSelection([]);
        }
      } catch (error) {
        if (!cancelled) {
          setFarmers([]);
          setSelectedFarmers([]);
          setLeftSelection([]);
          setRightSelection([]);
          console.error("Error fetching collections:", error);
          alert("Unable to load collection data. Please try again.");
        }
      }
    };

    fetchCollectionData();

    return () => {
      cancelled = true;
    };
  }, [fromDate, toDate]);

  const moveSelectedRight = () => {
    const moving = farmers.filter((farmer) =>
      leftSelection.includes(getFarmerCode(farmer))
    );

    setSelectedFarmers((previous) => {
      const existingCodes = new Set(previous.map(getFarmerCode));

      return [
        ...previous,
        ...moving.filter(
          (farmer) => !existingCodes.has(getFarmerCode(farmer))
        ),
      ];
    });

    setFarmers((previous) =>
      previous.filter(
        (farmer) =>
          !leftSelection.includes(getFarmerCode(farmer))
      )
    );

    setLeftSelection([]);
  };

  const moveAllRight = () => {
    setSelectedFarmers((previous) => {
      const existingCodes = new Set(previous.map(getFarmerCode));

      return [
        ...previous,
        ...farmers.filter(
          (farmer) => !existingCodes.has(getFarmerCode(farmer))
        ),
      ];
    });

    setFarmers([]);
    setLeftSelection([]);
  };

  const moveSelectedLeft = () => {
    const moving = selectedFarmers.filter((farmer) =>
      rightSelection.includes(getFarmerCode(farmer))
    );

    setFarmers((previous) => {
      const existingCodes = new Set(previous.map(getFarmerCode));

      return [
        ...previous,
        ...moving.filter(
          (farmer) => !existingCodes.has(getFarmerCode(farmer))
        ),
      ];
    });

    setSelectedFarmers((previous) =>
      previous.filter(
        (farmer) =>
          !rightSelection.includes(getFarmerCode(farmer))
      )
    );

    setRightSelection([]);
  };

  const moveAllLeft = () => {
    setFarmers((previous) => [...previous, ...selectedFarmers]);
    setSelectedFarmers([]);
    setRightSelection([]);
  };

  const toggleSelection = (code, side) => {
    const setter =
      side === "left" ? setLeftSelection : setRightSelection;

    setter((previous) =>
      previous.includes(code)
        ? previous.filter((item) => item !== code)
        : [...previous, code]
    );
  };

  const handleBill = () => {
    if (!fromDate || !toDate) {
      alert("Please select From Date and To Date.");
      return;
    }

    if (fromDate > toDate) {
      alert("From Date cannot be later than To Date.");
      return;
    }

    if (selectedFarmers.length === 0) {
      alert("Please select at least one farmer.");
      return;
    }

    const farmerCodes = selectedFarmers.map(getFarmerCode);

    const params = new URLSearchParams({
      from: fromDate,
      to: toDate,
      billDate: currentDate,
      farmers: JSON.stringify(farmerCodes),
    });

    const baseUrl = window.location.href.split("#")[0];
    const billUrl = `${baseUrl}#/bill-statement?${params.toString()}`;

    const newTab = window.open(billUrl, "_blank");

    if (!newTab) {
      alert(
        "The new tab was blocked by your browser. Please allow pop-ups and click Bill again."
      );
    }
  };

  const renderFarmerTable = (list, side, selection) => (
    <div className="gb-table-card">
      <div className="gb-table-heading">
        <img src={userIcon} alt="" />

        <span>
          {side === "left" ? "Farmers" : "Selected Farmers"}
        </span>
      </div>

      <div className="gb-table-scroll">
        <table className="gb-farmer-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Farmer Name</th>
            </tr>
          </thead>

          <tbody>
            {list.map((farmer) => {
              const code = getFarmerCode(farmer);
              const name = getFarmerName(farmer);

              return (
                <tr
                  key={code}
                  className={
                    selection.includes(code)
                      ? "gb-row-selected"
                      : ""
                  }
                  onClick={() => toggleSelection(code, side)}
                >
                  <td>{code}</td>
                  <td>{name}</td>
                </tr>
              );
            })}

            {Array.from({
              length: Math.max(0, 6 - list.length),
            }).map((_, index) => (
              <tr
                className="gb-empty-row"
                key={`empty-${index}`}
              >
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="gb-page">
      <div className="gb-container">
        <section className="gb-date-section">
          <div className="gb-date-field">
            <label htmlFor="gb-from-date">
              <img src={calendarIcon} alt="" />
              From Date
            </label>

            <input
              id="gb-from-date"
              type="date"
              value={fromDate}
              max={toDate || currentDate}
              onChange={(event) =>
                setFromDate(event.target.value)
              }
            />
          </div>

          <div className="gb-date-field">
            <label htmlFor="gb-to-date">
              <img src={calendarIcon} alt="" />
              To Date
            </label>

            <input
              id="gb-to-date"
              type="date"
              value={toDate}
              min={fromDate || undefined}
              max={currentDate}
              onChange={(event) =>
                setToDate(event.target.value)
              }
            />
          </div>

          <div className="gb-date-field">
            <label htmlFor="gb-current-date">
              <img src={calendarIcon} alt="" />
              Current Date
            </label>

            <input
              id="gb-current-date"
              type="date"
              value={currentDate}
              readOnly
            />
          </div>
        </section>

        <section className="gb-farmers-section">
          {renderFarmerTable(
            farmers,
            "left",
            leftSelection
          )}

          <div className="gb-transfer-controls">
            <button
              type="button"
              title="Move all to selected"
              onClick={moveAllRight}
            >
              <img
                src={chevronsRightIcon}
                alt="Move all right"
              />
            </button>

            <button
              type="button"
              title="Move all back"
              onClick={moveAllLeft}
            >
              <img
                src={chevronsLeftIcon}
                alt="Move all left"
              />
            </button>

            <button
              type="button"
              title="Move selected right"
              onClick={moveSelectedRight}
            >
              <img src={arrowRightIcon} alt="Move right" />
            </button>

            <button
              type="button"
              title="Move selected left"
              onClick={moveSelectedLeft}
            >
              <img src={arrowLeftIcon} alt="Move left" />
            </button>
          </div>

          {renderFarmerTable(
            selectedFarmers,
            "right",
            rightSelection
          )}
        </section>

        <div className="gb-bottom-actions">
          <button
            type="button"
            className="gb-bill-button"
            onClick={handleBill}
          >
            <img src={billIcon} alt="" />
            Bill
          </button>
        </div>
      </div>
    </div>
  );
}
