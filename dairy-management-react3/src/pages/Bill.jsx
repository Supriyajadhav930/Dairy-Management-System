
import { useEffect, useState } from "react";
import "./Bill.css";

const COLLECTION_API = "http://localhost:5000/api/collections";

function formatDate(date) {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function getCode(record) {
  return String(
    record.farmerCode ??
      record.farmer_code ??
      record.code ??
      ""
  );
}

function getName(record) {
  return String(
    record.farmerName ??
      record.farmer_name ??
      record.name ??
      ""
  );
}

function getNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function money(value) {
  return getNumber(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function average(records, field) {
  const validRecords = records.filter(
    (record) =>
      record[field] !== undefined &&
      record[field] !== null &&
      record[field] !== "" &&
      Number.isFinite(Number(record[field]))
  );

  if (validRecords.length === 0) return "0.0";

  const total = validRecords.reduce(
    (sum, record) => sum + getNumber(record[field]),
    0
  );

  return (total / validRecords.length).toFixed(1);
}

// Generate every date, including dates without collection.
function getAllDates(fromDate, toDate) {
  if (!fromDate || !toDate || fromDate > toDate) {
    return [];
  }

  const dates = [];
  const current = new Date(`${fromDate}T12:00:00`);
  const end = new Date(`${toDate}T12:00:00`);

  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");

    dates.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function FarmerBill({
  farmer,
  records,
  fromDate,
  toDate,
  billDate,
}) {
  const allDates = getAllDates(fromDate, toDate);

  const morning = records.filter(
    (record) => record.type === "morning"
  );

  const evening = records.filter(
    (record) => record.type === "evening"
  );

  const totalMilk = records.reduce(
    (sum, record) => sum + getNumber(record.litres),
    0
  );

  const totalAmount = records.reduce(
    (sum, record) => sum + getNumber(record.amount),
    0
  );

  // These are placeholders until actual deduction data is connected.
  const advanceReduction = 0;
  const feedReduction = 0;

  const finalAmount =
    totalAmount - advanceReduction - feedReduction;

  const renderCollectionTable = (title, entries) => {
    // Match one collection entry to each date.
    const rows = allDates.map((date) => {
      const record = entries.find(
        (item) => item.date === date
      );

      return { date, record };
    });

    return (
      <div className="bill-collection">
        <div className="bill-collection-title">
          {title}
        </div>

        <table className="bill-data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Milk<br />(L)</th>
              <th>Fat<br />(%)</th>
              <th>SNF<br />(%)</th>
              <th>Rate<br />(₹/L)</th>
              <th>Total Amount<br />(₹)</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(({ date, record }) => (
              <tr key={date}>
                <td>{formatDate(date)}</td>
                <td>
                  {record ? getNumber(record.litres).toFixed(1) : ""}
                </td>
                <td>
                  {record ? getNumber(record.fat).toFixed(1) : ""}
                </td>
                <td>
                  {record ? getNumber(record.snf).toFixed(1) : ""}
                </td>
                <td>
                  {record ? money(record.rate) : ""}
                </td>
                <td>
                  {record ? money(record.amount) : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <article className="farmer-bill">
      <h1 className="bill-centre-title">
        Sairaj Milk Collection Centre
      </h1>

      <div className="bill-divider" />

      <div className="bill-details">
        <div className="bill-farmer-details">
          <p>
            <strong>Farmer Name</strong>
            <span>:</span>
            <span>{getName(farmer)}</span>
          </p>

          <p>
            <strong>Farmer Code</strong>
            <span>:</span>
            <span>{getCode(farmer)}</span>
          </p>
        </div>

        <div className="bill-period-details">
          <p>
            <strong>Bill Period</strong>
            <span>:</span>
            <span>
              {formatDate(fromDate)} - {formatDate(toDate)}
            </span>
          </p>

          <p>
            <strong>Bill Date</strong>
            <span>:</span>
            <span>{formatDate(billDate)}</span>
          </p>
        </div>
      </div>

      <div className="bill-collections">
        {renderCollectionTable("MORNING COLLECTION", morning)}
        {renderCollectionTable("EVENING COLLECTION", evening)}
      </div>

      <div className="bill-summary">
        <div>
          <strong>Total Milk (L)</strong>
          <span>{totalMilk.toFixed(1)}</span>
        </div>

        <div>
          <strong>Avg Fat (%)</strong>
          <span>{average(records, "fat")}</span>
        </div>

        <div>
          <strong>Avg SNF (%)</strong>
          <span>{average(records, "snf")}</span>
        </div>

        <div>
          <strong>Advance Reduction (₹)</strong>
          <span>{money(advanceReduction)}</span>
        </div>

        <div>
          <strong>Feed Reduction (₹)</strong>
          <span>{money(feedReduction)}</span>
        </div>

        <div>
          <strong>Total Amount (₹)</strong>
          <span>{money(finalAmount)}</span>
        </div>
      </div>
    </article>
  );
}

export default function Bill() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = new URLSearchParams(
    window.location.hash.split("?")[1] || ""
  );

  const fromDate = params.get("from") || "";
  const toDate = params.get("to") || "";
  const billDate = params.get("billDate") || "";

  let farmerCodes = [];

  try {
    farmerCodes = JSON.parse(params.get("farmers") || "[]");
  } catch {
    farmerCodes = [];
  }

  const farmerCodesKey = JSON.stringify(farmerCodes);

  useEffect(() => {
    let cancelled = false;

    async function fetchCollections() {
      try {
        if (
          !fromDate ||
          !toDate ||
          fromDate > toDate ||
          !Array.isArray(farmerCodes) ||
          farmerCodes.length === 0
        ) {
          throw new Error(
            "Bill dates or selected farmers are missing or invalid."
          );
        }

        const response = await fetch(
          `${COLLECTION_API}?type=both&from=${encodeURIComponent(
            fromDate
          )}&to=${encodeURIComponent(toDate)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch collection records.");
        }

        const data = await response.json();

        const records = Array.isArray(data)
          ? data
          : data.collections ?? data.data ?? [];

        const selectedCodes = new Set(
          farmerCodes.map(String)
        );

        const filteredRecords = records.filter((record) =>
          selectedCodes.has(getCode(record))
        );

        if (!cancelled) {
          setCollections(filteredRecords);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load farmer bills."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCollections();

    return () => {
      cancelled = true;
    };
  }, [fromDate, toDate, farmerCodesKey]);

  if (loading) {
    return <div className="bill-message">Loading bills...</div>;
  }

  if (error) {
    return <div className="bill-message">{error}</div>;
  }

  const farmers = farmerCodes.map((code) => {
    const farmerRecords = collections.filter(
      (record) => getCode(record) === String(code)
    );

    return {
      code: String(code),
      name: getName(farmerRecords[0] || {}),
      records: farmerRecords,
    };
  });

  return (
    <main className="bill-page">
     
<div className="bill-toolbar">
  <h2>Farmer Bills</h2>

  <div className="bill-toolbar-actions">
    <button
      type="button"
      className="bill-back-button"
      onClick={() => {
        window.location.hash = "#/generate-bill";
      }}
    >
      ← Back
    </button>

    <button
      type="button"
      className="bill-pdf-button"
      onClick={() => window.print()}
    >
      Generate PDF
    </button>
  </div>
</div>


      {farmers.length === 0 ? (
        <p className="bill-message">
          No farmers were selected.
        </p>
      ) : (
        <div className="bill-print-area">
          {farmers.map((farmer) => (
            <FarmerBill
              key={farmer.code}
              farmer={{
                farmerCode: farmer.code,
                farmerName:
                  farmer.name || `Farmer ${farmer.code}`,
              }}
              records={farmer.records}
              fromDate={fromDate}
              toDate={toDate}
              billDate={billDate}
            />
          ))}
        </div>
      )}
    </main>
  );
}
