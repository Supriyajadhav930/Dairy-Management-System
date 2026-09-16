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
    {
        code: "F001",
        name: "Ramesh Patil"
    },
    {
        code: "F002",
        name: "Suresh Jadhav"
    },
    {
        code: "F003",
        name: "Ganesh Shinde"
    },
    {
        code: "F004",
        name: "Mahesh Pawar"
    },
    {
        code: "F005",
        name: "Vijay Chavan"
    }
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


    /* ================= SET DATE + LOAD RECORDS ================= */

    useEffect(() => {

        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        const todayDate = `${year}-${month}-${day}`;

        setDate(todayDate);
        setRecordsDate(todayDate);

        const savedRecords =
            JSON.parse(
                localStorage.getItem("eveningCollectionRecords")
            ) || [];

        setRecords(savedRecords);

    }, []);


    /* ================= FORMAT DATE ================= */

    const formatDate = (dateString) => {

        if (!dateString) {
            return "";
        }

        const parts = dateString.split("-");

        if (parts.length !== 3) {
            return dateString;
        }

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

    const handleSave = () => {

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
            id: Date.now(),

            code: farmerCode.trim().toUpperCase(),

            farmerName: farmerName,

            litres: Number(litres),

            fat: Number(fat),

            snf: Number(snf),

            degree: Number(degree),

            rate: Number(rate),

            amount: Number(amount),

            date: date
        };


        const oldRecords =
            JSON.parse(
                localStorage.getItem(
                    "eveningCollectionRecords"
                )
            ) || [];


        const updatedRecords = [
            ...oldRecords,
            newRecord
        ];


        localStorage.setItem(
            "eveningCollectionRecords",
            JSON.stringify(updatedRecords)
        );


        setRecords(updatedRecords);

        handleClear();

        alert(
            "Evening collection saved successfully."
        );
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

        const search = farmerSearch
            .trim()
            .toLowerCase();

        return (
            farmer.code
                .toLowerCase()
                .includes(search) ||

            farmer.name
                .toLowerCase()
                .includes(search)
        );
    });


    /* ================= FILTER RECORDS ================= */

    const todayRecords = records.filter(
        (record) =>
            record.date === recordsDate
    );


    /* ================= JSX ================= */

    return (

        <div className="container">

            {/* ================= TITLE ================= */}

            <h1>
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
                                placeholder="Enter farmer code"
                            />


                            <button
                                type="button"
                                className="farmer-search-btn"
                                onClick={
                                    handleFarmerSearch
                                }
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
                            placeholder="Farmer name"
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

                <div className="milk-details-title">
                    Milk Details
                </div>


                <div className="milk-details">

                    <MilkField
                        icon={litresIcon}
                        label="Litres"
                        value={litres}
                        setValue={setLitres}
                        inputRef={litresRef}
                        nextRef={fatRef}
                    />


                    <MilkField
                        icon={fatIcon}
                        label="Fat"
                        value={fat}
                        setValue={setFat}
                        inputRef={fatRef}
                        nextRef={snfRef}
                    />


                    <MilkField
                        icon={snfIcon}
                        label="SNF"
                        value={snf}
                        setValue={setSnf}
                        inputRef={snfRef}
                    />


                    <MilkField
                        icon={degreeIcon}
                        label="Degree"
                        value={degree}
                        setValue={setDegree}
                    />


                    <MilkField
                        icon={rateIcon}
                        label="Rate (₹/L)"
                        value={rate}
                        setValue={setRate}
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
                            value={amount}
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
                        onClick={
                            openFarmerModal
                        }
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


                    <div className="records-date">

                        <img
                            src={recordsCalendarIcon}
                            alt="Date"
                        />

                        <input
                            type="date"
                            value={recordsDate}
                            onChange={(e) =>
                                setRecordsDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* TOTAL */}

                <div className="total-records">

                    Total Records:{" "}
                    {todayRecords.length}

                </div>


                {/* ================= TABLE / NO RECORDS ================= */}

                {todayRecords.length === 0 ? (

                    <div className="no-records">

                        <img
                            src={noRecordsIcon}
                            alt="No records"
                        />

                        <p>
                            No records found
                        </p>

                    </div>

                ) : (

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

                                    <th>Date</th>

                                </tr>

                            </thead>


                            <tbody>

                                {todayRecords.map(
                                    (record, index) => (

                                        <tr
                                            key={
                                                record.id
                                            }
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
                                                {formatDate(
                                                    record.date
                                                )}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ================= FARMER MODAL ================= */}

            {showModal && (

                <div
                    className="modal active"
                    onClick={(e) => {

                        if (
                            e.target === e.currentTarget
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
                                onClick={
                                    closeFarmerModal
                                }
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
                                            key={
                                                farmer.code
                                            }
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
    nextRef
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
                onChange={(e) =>
                    setValue(e.target.value)
                }
                onKeyDown={(e) => {
                    if (e.key === "Enter" && nextRef) {
                        e.preventDefault();
                        nextRef.current?.focus();
                    }
                }}
                placeholder="0.00"
                min="0"
                step="0.01"
            />

        </div>
    );
}


export default Evening;