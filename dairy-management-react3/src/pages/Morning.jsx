import { useEffect, useState, useRef } from "react";
import "./morning.css";

/* ================= IMAGE IMPORTS ================= */

import farmerCodeIcon from "../assets/Morning_collections_img/farmer_code_user.png";
import searchIcon from "../assets/Morning_collections_img/search.png";
import farmerNameIcon from "../assets/Morning_collections_img/farmer_name_user.png";

import calendarIcon from "../assets/Morning_collections_img/date_calendar.png";
import dateChevronIcon from "../assets/Morning_collections_img/date_dropdown_chevron.png";

import litresIcon from "../assets/Morning_collections_img/litres_milk_can.png";
import fatIcon from "../assets/Morning_collections_img/fat_droplet.png";
import snfIcon from "../assets/Morning_collections_img/snf_molecule.png";
import degreeIcon from "../assets/Morning_collections_img/degree_thermometer.png";
import amountIcon from "../assets/Morning_collections_img/amount_calculator.png";

import saveIcon from "../assets/Morning_collections_img/save.png";
import clearIcon from "../assets/Morning_collections_img/clear_refresh.png";
import farmerListIcon from "../assets/Morning_collections_img/farmer_list.png";

import noRecordsIcon from "../assets/Morning_collections_img/no_records_document.png";
import recordsCalendarIcon from "../assets/Morning_collections_img/records_calendar.png";

/* ================= FARMER DATA ================= */

const FARMERS_API_URL = "http://localhost:5000/api/farmers";
const COLLECTIONS_API_URL = "http://localhost:5000/api/collections";

/* ================= TABLE STYLES ================= */

const tableHeadStyle = {
    padding: "10px 8px",
    border: "1px solid #d5e8dc",
    background: "#eaf6ee",
    color: "#075c35",
    fontWeight: 700,
    textAlign: "center",
    whiteSpace: "nowrap"
};

const tableCellStyle = {
    padding: "10px 8px",
    border: "1px solid #d5e8dc",
    color: "#333",
    textAlign: "center",
    whiteSpace: "nowrap"
};

/* ================= MAIN COMPONENT ================= */

function Morning() {
    const [farmerCode, setFarmerCode] = useState("");
    const [farmerName, setFarmerName] = useState("");
    const [date, setDate] = useState("");

    const [litres, setLitres] = useState("");
    const [fat, setFat] = useState("");
    const [snf, setSnf] = useState("");
    const [degree, setDegree] = useState("");
    const [rate, setRate] = useState("");

    const [records, setRecords] = useState([]);
    const [farmers, setFarmers] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [farmerSearch, setFarmerSearch] = useState("");
    const [recordsDate, setRecordsDate] = useState("");

    /* ================= EDITING RECORD ================= */

    const [editingRecordId, setEditingRecordId] =
        useState(null);

    const litresRef = useRef(null);
    const fatRef = useRef(null);
    const snfRef = useRef(null);
    const degreeRef = useRef(null);
    const rateRef = useRef(null);

    /* =========================================================
       SET DATE + LOAD FARMERS + LOAD COLLECTION RECORDS
       ========================================================= */

    useEffect(() => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            today.getDate()
        ).padStart(2, "0");

        const todayDate =
            `${year}-${month}-${day}`;

        setDate(todayDate);
        setRecordsDate(todayDate);

        /* ================= LOAD FARMERS ================= */

        fetch(FARMERS_API_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch farmers"
                    );
                }

                return response.json();
            })
            .then((data) => {
                setFarmers(
                    Array.isArray(data)
                        ? data
                        : []
                );
            })
            .catch((error) => {
                console.error(
                    "Error loading farmers:",
                    error
                );
            });

        /* ================= LOAD COLLECTIONS ================= */

        fetch(
            `${COLLECTIONS_API_URL}?type=morning`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch morning records"
                    );
                }

                return response.json();
            })
            .then((data) => {
                const recordsArray =
                    Array.isArray(data)
                        ? data
                        : data.data || [];

                const formattedRecords =
                    recordsArray.map(
                        (record) => ({
                            ...record,

                            id:
                                record._id ||
                                record.id,

                            code:
                                record.farmerCode ||
                                record.code
                        })
                    );

                setRecords(
                    formattedRecords
                );
            })
            .catch((error) => {
                console.error(
                    "Error loading morning records:",
                    error
                );
            });
    }, []);

    /* ================= FORMAT DATE ================= */

    const formatDate = (dateString) => {
        if (!dateString) {
            return "";
        }

        const parts =
            dateString.split("-");

        if (parts.length !== 3) {
            return dateString;
        }

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    /* =========================================================
       LOAD EXISTING COLLECTION RECORD
       ========================================================= */

    const loadExistingRecord = (
        code
    ) => {
        const normalizedCode =
            String(code || "")
                .trim()
                .toUpperCase();

        const existingRecord =
            records.find(
                (record) => {
                    const recordCode =
                        String(
                            record.farmerCode ||
                            record.code ||
                            ""
                        )
                            .trim()
                            .toUpperCase();

                    return (
                        recordCode ===
                            normalizedCode &&
                        record.date === date
                    );
                }
            );

        if (!existingRecord) {
            setEditingRecordId(null);

            setLitres("");
            setFat("");
            setSnf("");
            setDegree("");
            setRate("");

            return false;
        }

        const recordId =
            existingRecord.id ||
            existingRecord._id;

        setEditingRecordId(
            recordId
        );

        setLitres(
            existingRecord.litres !==
                undefined &&
                existingRecord.litres !== null
                ? String(
                      existingRecord.litres
                  )
                : ""
        );

        setFat(
            existingRecord.fat !==
                undefined &&
                existingRecord.fat !== null
                ? String(
                      existingRecord.fat
                  )
                : ""
        );

        setSnf(
            existingRecord.snf !==
                undefined &&
                existingRecord.snf !== null
                ? String(
                      existingRecord.snf
                  )
                : ""
        );

        setRate(
            existingRecord.rate !==
                undefined &&
                existingRecord.rate !== null
                ? String(
                      existingRecord.rate
                  )
                : ""
        );

        return true;
    };

    /* ================= SEARCH FARMER ================= */

    const handleFarmerSearch = () => {
        const code =
            farmerCode
                .trim()
                .toUpperCase();

        if (!code) {
            setFarmerName("");
            setEditingRecordId(null);

            alert(
                "Please enter Farmer Code."
            );

            return;
        }

        /* ================= FIND FARMER ================= */

        const farmer =
            farmers.find(
                (item) =>
                    String(
                        item.code || ""
                    )
                        .trim()
                        .toUpperCase() ===
                    code
            );

        if (!farmer) {
            setFarmerName("");
            setEditingRecordId(null);

            alert(
                "Farmer not found."
            );

            return;
        }

        setFarmerCode(
            String(
                farmer.code
            )
                .trim()
                .toUpperCase()
        );

        setFarmerName(
            farmer.name || ""
        );

        /* =====================================================
           CHECK EXISTING COLLECTION
           ===================================================== */

        loadExistingRecord(
            code
        );
    };

    /* ================= FARMER CODE INPUT ================= */

    const handleFarmerCodeChange = (
        value
    ) => {
        const code =
            value
                .trim()
                .toUpperCase();

        setFarmerCode(code);

        if (!code) {
            setFarmerName("");
            setEditingRecordId(null);

            setLitres("");
            setFat("");
            setSnf("");
            setDegree("");
            setRate("");

            return;
        }

        const farmer =
            farmers.find(
                (item) =>
                    String(
                        item.code || ""
                    )
                        .trim()
                        .toUpperCase() ===
                    code
            );

        if (farmer) {
            setFarmerName(
                farmer.name || ""
            );
        } else {
            setFarmerName("");
        }

        /*
         * Do not load record while typing.
         * Record is loaded when Search or Enter is pressed.
         */
    };

    /* ================= REFRESH FARMERS ================= */

    const refreshFarmers = async () => {
        try {
            const response =
                await fetch(
                    FARMERS_API_URL
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch farmers"
                );
            }

            const data =
                await response.json();

            setFarmers(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(
                "Error refreshing farmers:",
                error
            );
        }
    };

    /* ================= CALCULATE AMOUNT ================= */

    const amount =
        litres && rate
            ? (
                  Number(litres) *
                  Number(rate)
              ).toFixed(2)
            : "0.00";

    /* ================= CALCULATE DEGREE ================= */

    useEffect(() => {
        if (
            fat !== "" &&
            snf !== ""
        ) {
            const calculatedDegree =
                4 *
                (
                    Number(snf) -
                    0.21 *
                        Number(fat) -
                    0.36
                );

            setDegree(
                calculatedDegree.toFixed(
                    1
                )
            );
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

        /* EXIT UPDATE MODE */

        setEditingRecordId(null);
    };

    /* =========================================================
       SAVE / UPDATE RECORD
       ========================================================= */

    const handleSave = async () => {
        if (!farmerCode.trim()) {
            alert(
                "Please enter Farmer Code."
            );
            return;
        }

        if (!farmerName.trim()) {
            alert(
                "Please search the Farmer Code first."
            );
            return;
        }

        if (!litres) {
            alert(
                "Please enter Litres."
            );
            return;
        }

        if (!fat) {
            alert(
                "Please enter Fat."
            );
            return;
        }

        if (!snf) {
            alert(
                "Please enter SNF."
            );
            return;
        }

        if (!degree) {
            alert(
                "Please enter Degree."
            );
            return;
        }

        if (!rate) {
            alert(
                "Please enter Rate."
            );
            return;
        }

        /* ================= RECORD DATA ================= */

        const collectionRecord = {
            type: "morning",

            farmerCode:
                farmerCode
                    .trim()
                    .toUpperCase(),

            farmerName:
                farmerName,

            date:
                date,

            litres:
                Number(litres),

            fat:
                Number(fat),

            snf:
                Number(snf),

            degree:
                Number(degree),

            rate:
                Number(rate),

            amount:
                Number(amount)
        };

        try {
            /* =================================================
               UPDATE EXISTING RECORD
               ================================================= */

            if (editingRecordId) {
                const response =
                    await fetch(
                        `${COLLECTIONS_API_URL}/${editingRecordId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    collectionRecord
                                )
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                            "Failed to update collection record"
                    );
                }

                const updatedData =
                    result.data ||
                    result;

                const updatedRecord = {
                    ...updatedData,

                    id:
                        updatedData._id ||
                        editingRecordId,

                    code:
                        updatedData.farmerCode ||
                        collectionRecord.farmerCode
                };

                /* ================= UPDATE TABLE ================= */

                setRecords(
                    (
                        previousRecords
                    ) =>
                        previousRecords.map(
                            (record) => {
                                const recordId =
                                    record.id ||
                                    record._id;

                                return recordId ===
                                    editingRecordId
                                    ? updatedRecord
                                    : record;
                            }
                        )
                );

                /*
                 * NO SUCCESS ALERT
                 */

                handleClear();

                return;
            }

            /* =================================================
               CREATE NEW RECORD
               ================================================= */

            const response =
                await fetch(
                    COLLECTIONS_API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                collectionRecord
                            )
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Failed to save collection record"
                );
            }

            const savedData =
                result.data ||
                result;

            const savedRecord = {
                ...savedData,

                id:
                    savedData._id ||
                    savedData.id,

                code:
                    savedData.farmerCode ||
                    collectionRecord.farmerCode
            };

            /* ================= ADD TO TABLE ================= */

            setRecords(
                (
                    previousRecords
                ) => [
                    ...previousRecords,
                    savedRecord
                ]
            );

            /*
             * NO SUCCESS ALERT
             */

            handleClear();

        } catch (error) {
            console.error(
                "Error saving/updating morning record:",
                error
            );

            /*
             * This alert is only for an actual
             * backend/network error.
             */

            alert(
                error.message ||
                    "Failed to save morning collection."
            );
        }
    };

    /* ================= DELETE RECORD ================= */

    const handleDeleteRecord =
        async (id) => {
            if (
                !window.confirm(
                    "Are you sure you want to delete this record?"
                )
            ) {
                return;
            }

            try {
                const response =
                    await fetch(
                        `${COLLECTIONS_API_URL}/${id}`,
                        {
                            method:
                                "DELETE"
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                            "Failed to delete collection record"
                    );
                }

                setRecords(
                    (
                        previousRecords
                    ) =>
                        previousRecords.filter(
                            (record) => {
                                const recordId =
                                    record.id ||
                                    record._id;

                                return (
                                    recordId !==
                                    id
                                );
                            }
                        )
                );

                alert(
                    "Morning collection record deleted successfully!"
                );

            } catch (error) {
                console.error(
                    "Error deleting morning record:",
                    error
                );

                alert(
                    "Failed to delete morning collection record."
                );
            }
        };

    /* ================= FARMER MODAL ================= */

    const openFarmerModal =
        async () => {
            setFarmerSearch("");

            await refreshFarmers();

            setShowModal(true);
        };

    const closeFarmerModal =
        () => {
            setShowModal(false);
        };

    const selectFarmer = (
        farmer
    ) => {
        setFarmerCode(
            farmer.code
        );

        setFarmerName(
            farmer.name
        );

        /*
         * When farmer is selected from
         * list, check whether today's
         * record already exists.
         */

        loadExistingRecord(
            farmer.code
        );

        setShowModal(false);
    };

    const filteredFarmers =
        farmers.filter(
            (farmer) => {
                const search =
                    farmerSearch
                        .trim()
                        .toLowerCase();

                return (
                    String(
                        farmer.code ||
                            ""
                    )
                        .toLowerCase()
                        .includes(
                            search
                        ) ||
                    String(
                        farmer.name ||
                            ""
                    )
                        .toLowerCase()
                        .includes(
                            search
                        )
                );
            }
        );

    /* ================= TODAY'S RECORDS ================= */

    const todayRecords =
        records.filter(
            (record) =>
                record.date ===
                recordsDate
        );

    return (
        <div className="morning-container">

            {/* ================= TITLE ================= */}

            <h1>
                Morning Collection
            </h1>

            {/* ================= COLLECTION CARD ================= */}

            <div className="collection-card">

                {/* ================= TOP ROW ================= */}

                <div className="top-row">

                    {/* FARMER CODE */}

                    <div className="field-group">

                        <label>
                            <img
                                src={
                                    farmerCodeIcon
                                }
                                alt="Farmer Code"
                            />

                            Farmer Code
                        </label>

                        <div className="input-wrapper">

                            <input
                                type="text"
                                value={
                                    farmerCode
                                }
                                onChange={(
                                    e
                                ) =>
                                    handleFarmerCodeChange(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                onKeyDown={(
                                    e
                                ) => {
                                    if (
                                        e.key ===
                                        "Enter"
                                    ) {
                                        e.preventDefault();

                                        handleFarmerSearch();

                                        setTimeout(
                                            () => {
                                                litresRef.current?.focus();
                                            },
                                            0
                                        );
                                    }
                                }}
                                placeholder="Enter Farmer Code"
                            />

                            <button
                                type="button"
                                className="farmer-search-btn"
                                onClick={
                                    handleFarmerSearch
                                }
                            >
                                <img
                                    src={
                                        searchIcon
                                    }
                                    alt="Search"
                                />
                            </button>

                        </div>
                    </div>

                    {/* FARMER NAME */}

                    <div className="field-group">

                        <label>
                            <img
                                src={
                                    farmerNameIcon
                                }
                                alt="Farmer Name"
                            />

                            Farmer Name
                        </label>

                        <input
                            type="text"
                            value={
                                farmerName
                            }
                            readOnly
                            className="readonly-input"
                            placeholder="(Name will appear here)"
                        />

                    </div>

                    {/* DATE */}

                    <div className="field-group">

                        <label>
                            <img
                                src={
                                    calendarIcon
                                }
                                alt="Date"
                            />

                            Date
                        </label>

                        <div className="date-wrapper">

                            <input
                                type="date"
                                value={
                                    date
                                }
                                onChange={(
                                    e
                                ) => {
                                    if (
                                        /^\d{4}-\d{2}-\d{2}$/.test(
                                            e
                                                .target
                                                .value
                                        )
                                    ) {
                                        setDate(
                                            e
                                                .target
                                                .value
                                        );

                                        /*
                                         * Changing date
                                         * exits update mode.
                                         */

                                        setEditingRecordId(
                                            null
                                        );

                                        setLitres(
                                            ""
                                        );
                                        setFat(
                                            ""
                                        );
                                        setSnf(
                                            ""
                                        );
                                        setDegree(
                                            ""
                                        );
                                        setRate(
                                            ""
                                        );
                                    }
                                }}
                            />

                            <img
                                src={
                                    dateChevronIcon
                                }
                                alt=""
                            />

                        </div>

                    </div>

                </div>

                {/* ================= MILK DETAILS ================= */}

                <div className="milk-details">

                    <MilkField
                        icon={
                            litresIcon
                        }
                        label="Litres (L)"
                        value={
                            litres
                        }
                        setValue={
                            setLitres
                        }
                        inputRef={
                            litresRef
                        }
                        nextRef={
                            fatRef
                        }
                        placeholder="Enter Litres"
                    />

                    <MilkField
                        icon={
                            fatIcon
                        }
                        label="Fat"
                        value={
                            fat
                        }
                        setValue={
                            setFat
                        }
                        inputRef={
                            fatRef
                        }
                        nextRef={
                            snfRef
                        }
                        placeholder="Enter Fat"
                    />

                    <MilkField
                        icon={
                            snfIcon
                        }
                        label="SNF"
                        value={
                            snf
                        }
                        setValue={
                            setSnf
                        }
                        inputRef={
                            snfRef
                        }
                        nextRef={
                            rateRef
                        }
                        placeholder="Enter SNF"
                    />

                    <MilkField
                        icon={
                            degreeIcon
                        }
                        label="Degree"
                        value={
                            degree
                        }
                        inputRef={
                            degreeRef
                        }
                        nextRef={
                            rateRef
                        }
                        placeholder="Auto Calculated"
                        readOnly
                    />

                    {/* RATE */}

                    <div className="milk-field">

                        <label>

                            <span className="rupee-icon-badge">
                                ₹
                            </span>

                            Rate (₹/L)

                        </label>

                        <input
                            ref={
                                rateRef
                            }
                            type="number"
                            value={
                                rate
                            }
                            onChange={(
                                e
                            ) =>
                                setRate(
                                    e
                                        .target
                                        .value
                                )
                            }
                            onKeyDown={(
                                e
                            ) => {
                                if (
                                    e.key ===
                                    "Enter"
                                ) {
                                    e.preventDefault();

                                    handleSave();
                                }
                            }}
                            placeholder="Enter Rate"
                            min="0"
                            step="0.01"
                        />

                    </div>

                    {/* AMOUNT */}

                    <div className="milk-field">

                        <label>

                            <img
                                src={
                                    amountIcon
                                }
                                alt="Amount"
                            />

                            Amount (₹)

                        </label>

                        <input
                            type="text"
                            value={
                                amount ===
                                "0.00"
                                    ? ""
                                    : amount
                            }
                            placeholder="Auto Calculated"
                            readOnly
                            className="amount-input"
                        />

                    </div>

                </div>

                {/* ================= ACTION BUTTONS ================= */}

                <div className="action-buttons">

                    <button
                        type="button"
                        className="save-btn"
                        onClick={
                            handleSave
                        }
                    >
                        <img
                            src={
                                saveIcon
                            }
                            alt="Save"
                        />

                        Save
                    </button>

                    <button
                        type="button"
                        className="clear-btn"
                        onClick={
                            handleClear
                        }
                    >
                        <img
                            src={
                                clearIcon
                            }
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
                            src={
                                farmerListIcon
                            }
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
                            src={
                                noRecordsIcon
                            }
                            alt="Records"
                        />

                        <h2>
                            Today's Records
                        </h2>

                    </div>

                    <div className="records-right">

                        <div className="records-date">

                            <img
                                src={
                                    recordsCalendarIcon
                                }
                                alt="Date"
                            />

                            <span>
                                Date:
                            </span>

                            <span className="date-display-text">
                                {formatDate(
                                    recordsDate
                                )}
                            </span>

                            <input
                                type="date"
                                className="hidden-date-picker"
                                value={
                                    recordsDate
                                }
                                onChange={(
                                    e
                                ) => {
                                    if (
                                        /^\d{4}-\d{2}-\d{2}$/.test(
                                            e
                                                .target
                                                .value
                                        )
                                    ) {
                                        setRecordsDate(
                                            e
                                                .target
                                                .value
                                        );
                                    }
                                }}
                            />

                        </div>

                        <div className="total-records">

                            Total Records:{" "}

                            <span>
                                {
                                    todayRecords.length
                                }
                            </span>

                        </div>

                    </div>

                </div>

                {/* ================= TABLE ================= */}

                <div className="table-container">

                    <table className="records-table">

                        <thead>

                            <tr>

                                <th>
                                    Sr. No.
                                </th>

                                <th>
                                    Code
                                </th>

                                <th>
                                    Farmer Name
                                </th>

                                <th>
                                    Litres (L)
                                </th>

                                <th>
                                    Fat
                                </th>

                                <th>
                                    SNF
                                </th>

                                <th>
                                    Degree
                                </th>

                                <th>
                                    Rate (₹/L)
                                </th>

                                <th>
                                    Amount (₹)
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {todayRecords.length ===
                            0 ? (

                                <tr className="empty-record-row">

                                    <td colSpan="10">

                                        <div className="no-records">

                                            <div className="no-records-divider">

                                                <span className="divider-line"></span>

                                                <img
                                                    src={
                                                        noRecordsIcon
                                                    }
                                                    alt="No records"
                                                />

                                                <span className="divider-line"></span>

                                            </div>

                                            <p>
                                                No records found
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                todayRecords.map(
                                    (
                                        record,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                record.id ||
                                                record._id ||
                                                index
                                            }
                                        >

                                            <td>
                                                {
                                                    index +
                                                    1
                                                }
                                            </td>

                                            <td>
                                                {
                                                    record.code ||
                                                    record.farmerCode
                                                }
                                            </td>

                                            <td>
                                                {
                                                    record.farmerName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    record.litres
                                                }
                                            </td>

                                            <td>
                                                {
                                                    record.fat
                                                }
                                            </td>

                                            <td>
                                                {
                                                    record.snf
                                                }
                                            </td>

                                            <td>
                                                {
                                                    record.degree
                                                }
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    record.rate
                                                ).toFixed(
                                                    2
                                                )}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    record.amount
                                                ).toFixed(
                                                    2
                                                )}
                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="table-delete-btn"
                                                    title="Delete record"
                                                    onClick={() =>
                                                        handleDeleteRecord(
                                                            record.id ||
                                                            record._id
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

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* ================= FARMER MODAL ================= */}

            {showModal && (

                <div
                    className="modal active"
                    onClick={(
                        e
                    ) => {
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
                                value={
                                    farmerSearch
                                }
                                onChange={(
                                    e
                                ) =>
                                    setFarmerSearch(
                                        e
                                            .target
                                            .value
                                    )
                                }
                            />

                        </div>

                        <div
                            className="farmer-list"
                            style={{
                                overflowX:
                                    "auto",
                                width:
                                    "100%"
                            }}
                        >

                            {filteredFarmers.length >
                            0 ? (

                                <table
                                    style={{
                                        width:
                                            "100%",
                                        minWidth:
                                            "850px",
                                        borderCollapse:
                                            "collapse",
                                        background:
                                            "#fff"
                                    }}
                                >

                                    <thead>

                                        <tr>

                                            <th style={tableHeadStyle}>
                                                Sr. No.
                                            </th>

                                            <th style={tableHeadStyle}>
                                                Farmer Code
                                            </th>

                                            <th style={tableHeadStyle}>
                                                Farmer Name
                                            </th>

                                            <th style={tableHeadStyle}>
                                                Phone
                                            </th>

                                            <th style={tableHeadStyle}>
                                                Email
                                            </th>

                                            <th style={tableHeadStyle}>
                                                PhonePe
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredFarmers.map(
                                            (
                                                farmer,
                                                index
                                            ) => (

                                                <tr
                                                    key={
                                                        farmer._id ||
                                                        farmer.code ||
                                                        index
                                                    }
                                                    onClick={() =>
                                                        selectFarmer(
                                                            farmer
                                                        )
                                                    }
                                                    style={{
                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >

                                                    <td style={tableCellStyle}>
                                                        {
                                                            index +
                                                            1
                                                        }
                                                    </td>

                                                    <td style={tableCellStyle}>
                                                        {
                                                            farmer.code ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td style={tableCellStyle}>
                                                        {
                                                            farmer.name ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td style={tableCellStyle}>
                                                        {
                                                            farmer.phone ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td style={tableCellStyle}>
                                                        {
                                                            farmer.email ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td style={tableCellStyle}>
                                                        {
                                                            farmer.phonePay ||
                                                            farmer.phonepay ||
                                                            farmer.phonePe ||
                                                            "-"
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

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

/* =========================================================
   MILK FIELD COMPONENT
   ========================================================= */

function MilkField({
    icon,
    label,
    value,
    setValue,
    inputRef,
    nextRef,
    placeholder,
    readOnly = false
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
                    if (
                        e.key ===
                            "Enter" &&
                        nextRef
                    ) {
                        e.preventDefault();

                        nextRef.current?.focus();
                    }
                }}
                placeholder={
                    placeholder
                }
                readOnly={readOnly}
                min="0"
                step="0.01"
            />

        </div>
    );
}

export default Morning;