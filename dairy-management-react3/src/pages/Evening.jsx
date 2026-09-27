import { useEffect, useState, useRef } from "react";
import "./evening.css";

/* ================= IMAGE IMPORTS ================= */

import farmerCodeIcon from "../assets/Evening_collection_img/farmer_code_user.png";
import searchIcon from "../assets/Evening_collection_img/search.png";
import farmerNameIcon from "../assets/Evening_collection_img/farmer_name_user.png";

import calendarIcon from "../assets/Evening_collection_img/date_calendar.png";
import dateChevronIcon from "../assets/Evening_collection_img/date_dropdown_chevron.png";

import litresIcon from "../assets/Evening_collection_img/litres_milk_can.png";
import fatIcon from "../assets/Evening_collection_img/fat_droplet.png";
import snfIcon from "../assets/Evening_collection_img/snf_molecule.png";
import degreeIcon from "../assets/Evening_collection_img/degree_thermometer.png";
import rateIcon from "../assets/Evening_collection_img/rate_rupee.png";
import amountIcon from "../assets/Evening_collection_img/amount_calculator.png";

import saveIcon from "../assets/Evening_collection_img/save.png";
import clearIcon from "../assets/Evening_collection_img/clear_refresh.png";
import farmerListIcon from "../assets/Evening_collection_img/farmer_list.png";

import noRecordsIcon from "../assets/Evening_collection_img/no_records_document.png";
import recordsCalendarIcon from "../assets/Evening_collection_img/records_calendar.png";

/* ================= FARMER DATA ================= */

const farmers = [
    { code: "F001", name: "Ramesh Patil" },
    { code: "F002", name: "Suresh Jadhav" },
    { code: "F003", name: "Ganesh Shinde" },
    { code: "F004", name: "Mahesh Pawar" },
    { code: "F005", name: "Vijay Chavan" }
];

/* ================= MAIN COMPONENT ================= */

function Evening() {
    const [farmerCode, setFarmerCode] = useState("");
    const [farmerName, setFarmerName] = useState("");

    const [date, setDate] = useState("");

    const [litres, setLitres] = useState("");
    const [fat, setFat] = useState("");
    const [snf, setSnf] = useState("");
    const [degree, setDegree] = useState("");
    const [rate, setRate] = useState("");

    const [records, setRecords] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [farmerSearch, setFarmerSearch] = useState("");

    const [recordsDate, setRecordsDate] = useState("");

    const litresRef = useRef(null);
    const fatRef = useRef(null);
    const snfRef = useRef(null);
    const rateRef = useRef(null);

    /* ================= SET DATE + LOAD RECORDS ================= */

    useEffect(() => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        const todayDate = `${year}-${month}-${day}`;

        setDate(todayDate);
        setRecordsDate(todayDate);

        /* ================= LOAD EVENING RECORDS FROM BACKEND ================= */

        fetch("http://localhost:5000/api/collections?type=evening")
            .then((response) => response.json())
            .then((data) => {
                const formattedRecords = data.map((record) => ({
                    ...record,
                    id: record._id,
                    code: record.farmerCode
                }));

                setRecords(formattedRecords);
            })
            .catch((error) => {
                console.error(
                    "Error loading evening records:",
                    error
                );
            });
    }, []);

    /* ================= FORMAT DATE ================= */

    const formatDate = (dateString) => {
        if (!dateString) return "";

        const parts = dateString.split("-");

        if (parts.length !== 3) return dateString;

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    /* ================= SEARCH FARMER ================= */

    const handleFarmerSearch = () => {
        const code = farmerCode.trim().toUpperCase();

        if (!code) {
            alert("Please enter Farmer Code.");
            return;
        }

        const farmer = farmers.find(
            (item) => item.code === code
        );

        if (!farmer) {
            alert("Farmer not found.");
            setFarmerName("");
            return;
        }

        setFarmerName(farmer.name);
    };

    /* ================= CALCULATE AMOUNT ================= */

    const amount =
        litres && rate
            ? (Number(litres) * Number(rate)).toFixed(2)
            : "0.00";

    /* ================= CALCULATE DEGREE FROM FAT + SNF ================= */

    useEffect(() => {
        if (fat !== "" && snf !== "") {
            const calculatedDegree =
                4 *
                (
                    Number(snf) -
                    (0.21 * Number(fat)) -
                    0.36
                );

            setDegree(calculatedDegree.toFixed(1));
        } else {
            setDegree("");
        }
    }, [fat, snf]);

    /* ================= CLEAR FORM ================= */

    const handleClear = () => {
        setFarmerCode("");
        setFarmerName("");
        setLitres("");
        setFat("");
        setSnf("");
        setDegree("");
        setRate("");
    };

    /* ================= SAVE RECORD ================= */

    const handleSave = async () => {
        if (!farmerCode.trim()) {
            alert("Please enter Farmer Code.");
            return;
        }

        if (!farmerName.trim()) {
            alert("Please search the Farmer Code first.");
            return;
        }

        if (!litres) {
            alert("Please enter Litres.");
            return;
        }

        if (!fat) {
            alert("Please enter Fat.");
            return;
        }

        if (!snf) {
            alert("Please enter SNF.");
            return;
        }

        if (!degree) {
            alert("Please enter Degree.");
            return;
        }

        if (!rate) {
            alert("Please enter Rate.");
            return;
        }

        const newRecord = {
            type: "evening",
            farmerCode: farmerCode.trim().toUpperCase(),
            farmerName: farmerName,
            litres: Number(litres),
            fat: Number(fat),
            snf: Number(snf),
            degree: Number(degree),
            rate: Number(rate),
            amount: Number(amount),
            date: date
        };

        try {
            const response = await fetch(
                "http://localhost:5000/api/collections",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(newRecord)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to save collection record"
                );
            }

            const savedRecord = {
                ...result.data,
                id: result.data._id,
                code: result.data.farmerCode
            };

            setRecords((previousRecords) => [
                ...previousRecords,
                savedRecord
            ]);

            alert("Evening collection saved successfully!");

            handleClear();

        } catch (error) {
            console.error(
                "Error saving evening record:",
                error
            );

            alert("Failed to save evening collection.");
        }
    };

    /* ================= DELETE RECORD ================= */

  const handleDeleteRecord = async (id) => {
    if (
        !window.confirm(
            "Are you sure you want to delete this record?"
        )
    ) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/collections/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                    "Failed to delete collection record"
            );
        }

        setRecords((previousRecords) =>
            previousRecords.filter(
                (record) => record.id !== id
            )
        );

        alert(
            "Evening collection record deleted successfully!"
        );

    } catch (error) {
        console.error(
            "Error deleting evening record:",
            error
        );

        alert(
            "Failed to delete evening collection record."
        );
    }
};
    /* ================= OPEN FARMER MODAL ================= */

    const openFarmerModal = () => {
        setFarmerSearch("");
        setShowModal(true);
    };

    /* ================= CLOSE FARMER MODAL ================= */

    const closeFarmerModal = () => {
        setShowModal(false);
    };

    /* ================= SELECT FARMER ================= */

    const selectFarmer = (farmer) => {
        setFarmerCode(farmer.code);
        setFarmerName(farmer.name);
        setShowModal(false);
    };

    /* ================= FILTER FARMERS ================= */

    const filteredFarmers = farmers.filter((farmer) => {
        const search = farmerSearch.trim().toLowerCase();

        return (
            farmer.code.toLowerCase().includes(search) ||
            farmer.name.toLowerCase().includes(search)
        );
    });

    /* ================= FILTER RECORDS ================= */

    const todayRecords = records.filter(
        (record) => record.date === recordsDate
    );

    /* ================= JSX ================= */

    return (
        <div className="container">

            {/* ================= OUTER WHITE PAGE CARD ================= */}

            <div className="page-outer-card">

                {/* ================= TITLE ================= */}

                <h1 className="page-main-heading">
                    Evening Collection
                </h1>

                {/* ================= COLLECTION CARD ================= */}

                <div className="collection-card">

                    {/* ================= TOP ROW ================= */}

                    <div className="top-row">

                        {/* FARMER CODE */}

                        <div className="field-group">

                            <label>
                                <img
                                    src={farmerCodeIcon}
                                    alt="Farmer Code"
                                />

                                Farmer Code
                            </label>

                            <div className="input-wrapper">

                                <input
                                    type="text"
                                    value={farmerCode}
                                    onChange={(e) =>
                                        setFarmerCode(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter Farmer Code"
                                />

                                <button
                                    type="button"
                                    className="farmer-search-btn"
                                    onClick={handleFarmerSearch}
                                >
                                    <img
                                        src={searchIcon}
                                        alt="Search"
                                    />
                                </button>

                            </div>

                        </div>

                        {/* FARMER NAME */}

                        <div className="field-group">

                            <label>
                                <img
                                    src={farmerNameIcon}
                                    alt="Farmer Name"
                                />

                                Farmer Name
                            </label>

                            <input
                                type="text"
                                value={farmerName}
                                readOnly
                                placeholder="(Name will appear here)"
                            />

                        </div>

                        {/* DATE */}

                        <div className="field-group">

                            <label>
                                <img
                                    src={calendarIcon}
                                    alt="Date"
                                />

                                Date
                            </label>

                            <div className="date-wrapper">

                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        setDate(
                                            e.target.value
                                        )
                                    }
                                />

                                <img
                                    src={dateChevronIcon}
                                    alt=""
                                />

                            </div>

                        </div>

                    </div>

                    {/* ================= MILK DETAILS ================= */}

                    <div className="milk-details">

                        <MilkField
                            icon={litresIcon}
                            label="Litres (L)"
                            value={litres}
                            setValue={setLitres}
                            inputRef={litresRef}
                            nextRef={fatRef}
                            placeholder="Enter Litres"
                        />

                        <MilkField
                            icon={fatIcon}
                            label="Fat"
                            value={fat}
                            setValue={setFat}
                            inputRef={fatRef}
                            nextRef={snfRef}
                            placeholder="Enter Fat"
                        />

                        <MilkField
                            icon={snfIcon}
                            label="SNF"
                            value={snf}
                            setValue={setSnf}
                            inputRef={snfRef}
                            nextRef={rateRef}
                            placeholder="Enter SNF"
                        />

                        <MilkField
                            icon={degreeIcon}
                            label="Degree"
                            value={degree}
                            placeholder="Auto Calculated"
                            readOnly
                        />

                        <MilkField
                            icon={rateIcon}
                            label="Rate (₹/L)"
                            value={rate}
                            setValue={setRate}
                            inputRef={rateRef}
                            placeholder="Enter Rate"
                            onEnter={handleSave}
                        />

                        {/* AMOUNT */}

                        <div className="milk-field">

                            <label>
                                <img
                                    src={amountIcon}
                                    alt="Amount"
                                />

                                Amount (₹)
                            </label>

                            <input
                                type="text"
                                value={
                                    amount === "0.00"
                                        ? ""
                                        : amount
                                }
                                placeholder="Auto Calculated"
                                readOnly
                            />

                        </div>

                    </div>

                    {/* ================= ACTION BUTTONS ================= */}

                    <div className="action-buttons">

                        <button
                            type="button"
                            className="save-btn"
                            onClick={handleSave}
                        >
                            <img
                                src={saveIcon}
                                alt="Save"
                            />

                            Save
                        </button>

                        <button
                            type="button"
                            className="clear-btn"
                            onClick={handleClear}
                        >
                            <img
                                src={clearIcon}
                                alt="Clear"
                            />

                            Clear
                        </button>

                        <button
                            type="button"
                            className="farmer-list-btn"
                            onClick={openFarmerModal}
                        >
                            <img
                                src={farmerListIcon}
                                alt="Farmer List"
                            />

                            Farmer List
                        </button>

                    </div>

                </div>

                {/* ================= RECORDS SECTION ================= */}

                <div className="records-section">

                    <div className="records-header">

                        <div className="records-title">

                            <img
                                src={noRecordsIcon}
                                alt="Records"
                            />

                            <h2>
                                Today's Records
                            </h2>

                        </div>

                        <div className="records-summary">

                            <div className="records-date">

                                <img
                                    src={recordsCalendarIcon}
                                    alt="Date"
                                />

                                <span>
                                    Date:
                                </span>

                                <strong>
                                    {formatDate(recordsDate)}
                                </strong>

                            </div>

                            <div className="total-records">
                                Total Records:{" "}
                                {todayRecords.length}
                            </div>

                        </div>

                    </div>

                    {/* ================= TABLE ================= */}

                    <div className="table-container">

                        <table className="records-table">

                            <thead>

                                <tr>

                                    <th>Sr. No.</th>
                                    <th>Code</th>
                                    <th>Farmer Name</th>
                                    <th>Litres (L)</th>
                                    <th>Fat</th>
                                    <th>SNF</th>
                                    <th>Degree</th>
                                    <th>Rate (₹/L)</th>
                                    <th>Amount (₹)</th>
                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {todayRecords.length > 0 ? (

                                    todayRecords.map(
                                        (record, index) => (

                                            <tr
                                                key={record.id}
                                            >

                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    {record.code}
                                                </td>

                                                <td>
                                                    {record.farmerName}
                                                </td>

                                                <td>
                                                    {record.litres}
                                                </td>

                                                <td>
                                                    {record.fat}
                                                </td>

                                                <td>
                                                    {record.snf}
                                                </td>

                                                <td>
                                                    {record.degree}
                                                </td>

                                                <td>
                                                    ₹
                                                    {Number(
                                                        record.rate
                                                    ).toFixed(2)}
                                                </td>

                                                <td>
                                                    ₹
                                                    {Number(
                                                        record.amount
                                                    ).toFixed(2)}
                                                </td>

                                                <td>

                                                    <button
                                                        type="button"
                                                        className="table-delete-btn"
                                                        title="Delete record"
                                                        onClick={() =>
                                                            handleDeleteRecord(
                                                                record.id
                                                            )
                                                        }
                                                    >

                                                        <svg
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >

                                                            <polyline points="3 6 5 6 21 6"></polyline>

                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>

                                                            <line
                                                                x1="10"
                                                                y1="11"
                                                                x2="10"
                                                                y2="17"
                                                            ></line>

                                                            <line
                                                                x1="14"
                                                                y1="11"
                                                                x2="14"
                                                                y2="17"
                                                            ></line>

                                                        </svg>

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr className="empty-record-row">

                                        <td colSpan="10">

                                            <div className="no-records">

                                                <div className="no-records-decoration">

                                                    <span></span>

                                                    <img
                                                        src={noRecordsIcon}
                                                        alt="No records"
                                                    />

                                                    <span></span>

                                                </div>

                                                <p>
                                                    No records found
                                                </p>

                                            </div>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* ================= FARMER MODAL ================= */}

            {showModal && (

                <div
                    className="modal active"
                    onClick={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeFarmerModal();
                        }

                    }}
                >

                    <div className="modal-content">

                        <div className="modal-header">

                            <h2>
                                Farmer List
                            </h2>

                            <button
                                type="button"
                                className="close-modal"
                                onClick={closeFarmerModal}
                            >
                                ×
                            </button>

                        </div>

                        <div className="farmer-search">

                            <input
                                type="text"
                                placeholder="Search farmer..."
                                value={farmerSearch}
                                onChange={(e) =>
                                    setFarmerSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="farmer-list">

                            {filteredFarmers.length > 0 ? (

                                filteredFarmers.map(
                                    (farmer) => (

                                        <div
                                            className="farmer-item"
                                            key={farmer.code}
                                            onClick={() =>
                                                selectFarmer(
                                                    farmer
                                                )
                                            }
                                        >

                                            <strong>
                                                {farmer.code}
                                            </strong>

                                            <span>
                                                {farmer.name}
                                            </span>

                                        </div>

                                    )
                                )

                            ) : (

                                <div className="no-records">

                                    <p>
                                        No farmer found
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

/* ================= MILK FIELD COMPONENT ================= */

function MilkField({
    icon,
    label,
    value,
    setValue,
    inputRef,
    nextRef,
    placeholder,
    readOnly = false,
    onEnter
}) {
    return (
        <div className="milk-field">

            <label>

                <img
                    src={icon}
                    alt={label}
                />

                {label}

            </label>

            <input
                ref={inputRef}
                type="number"
                value={value}
                onChange={(e) => {

                    if (
                        !readOnly &&
                        setValue
                    ) {
                        setValue(
                            e.target.value
                        );
                    }

                }}
                onKeyDown={(e) => {

                    if (e.key === "Enter") {

                        e.preventDefault();

                        if (onEnter) {

                            onEnter();

                        } else if (nextRef) {

                            nextRef.current?.focus();

                        }

                    }

                }}
                placeholder={placeholder}
                readOnly={readOnly}
                min="0"
                step="0.01"
            />

        </div>
    );
}

export default Evening;