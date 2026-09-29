import React, { useState } from "react";
import "./Add_Farmer.css";

/* =========================
   ICONS
========================= */

const UserCodeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 8h10M7 12h6M7 16h4" />
    </svg>
);

const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
);

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <path d="M10 18h4" />
    </svg>
);

const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
    </svg>
);

const RupeeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 4h12M6 8h12M9 4c4 0 6 2 6 4s-2 4-6 4H7l8 8" />
    </svg>
);

const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3" />
        <path d="M5 4v4h4M19 20v-4h-4" />
    </svg>
);

const SaveIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 3h12l2 2v16H5z" />
        <path d="M8 3v6h8V3M8 21v-7h8v7" />
    </svg>
);

const ListIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 6h13M8 12h13M8 18h13" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
    </svg>
);

const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
);

const DeleteIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 15H6L5 6" />
        <path d="M10 11v6M14 11v6" />
    </svg>
);

/* =========================
   ADD FARMER COMPONENT
========================= */

function AddFarmer() {
    const [farmers, setFarmers] = useState([
        { id: 1, code: "1", name: "-", phone: "-", email: "-", phonePay: "-" },
        { id: 2, code: "2", name: "-", phone: "-", email: "-", phonePay: "-" },
        { id: 3, code: "3", name: "-", phone: "-", email: "-", phonePay: "-" },
        { id: 4, code: "4", name: "-", phone: "-", email: "-", phonePay: "-" },
        { id: 5, code: "5", name: "-", phone: "-", email: "-", phonePay: "-" }
    ]);

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        phone: "",
        email: "",
        phonePay: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "code") {
            setFormData({ ...formData, [name]: value.replace(/\D/g, "") });
        } else if (name === "phone" || name === "phonePay") {
            setFormData({ ...formData, [name]: value.replace(/\D/g, "").slice(0, 10) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleClear = () => {
        setFormData({ code: "", name: "", phone: "", email: "", phonePay: "" });
        setEditingId(null);
    };

    const handleSave = () => {
        const { code, name, phone, email, phonePay } = formData;

        if (!code || !name || !phone || !email || !phonePay) {
            alert("Please fill all fields.");
            return;
        }

        if (phone.length !== 10) {
            alert("Phone number must be 10 digits.");
            return;
        }

        if (phonePay.length !== 10) {
            alert("Phone Pay number must be 10 digits.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const duplicateCode = farmers.some(
            (farmer) => farmer.code === code && farmer.id !== editingId
        );

        if (duplicateCode) {
            alert("Farmer code already exists.");
            return;
        }

        if (editingId) {
            setFarmers(
                farmers.map((farmer) =>
                    farmer.id === editingId
                        ? { ...farmer, code, name, phone, email, phonePay }
                        : farmer
                )
            );
            alert("Farmer updated successfully.");
        } else {
            const newFarmer = {
                id: Date.now(),
                code,
                name,
                phone,
                email,
                phonePay
            };
            setFarmers([...farmers, newFarmer]);
            alert("Farmer saved successfully.");
        }

        handleClear();
    };

    const handleEdit = (farmer) => {
        setFormData({
            code: farmer.code,
            name: farmer.name === "-" ? "" : farmer.name,
            phone: farmer.phone === "-" ? "" : farmer.phone,
            email: farmer.email === "-" ? "" : farmer.email,
            phonePay: farmer.phonePay === "-" ? "" : farmer.phonePay
        });
        setEditingId(farmer.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this farmer?");
        if (!confirmDelete) return;
        setFarmers(farmers.filter((farmer) => farmer.id !== id));
    };

    const filteredFarmers = farmers.filter((farmer) => {
        const searchText = search.toLowerCase();
        return (
            farmer.code.toLowerCase().includes(searchText) ||
            farmer.name.toLowerCase().includes(searchText)
        );
    });

    return (
        <div className="add-farmer-page">
            <div className="farmer-main-container">
                {/* HEADER */}
                <header className="farmer-header">
                    <div className="header-title-section">
                        <h1>Add Farmers</h1>
                        <div className="title-decoration">
                            <span></span>
                            <div className="leaf-decoration">
                                <span>❧</span>
                            </div>
                            <span></span>
                        </div>
                    </div>
                </header>

                {/* FORM */}
                <div className="farmer-form">
                    <div className="form-group">
                        <label><UserCodeIcon /> Farmer Code</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="Enter Farmer Code"
                        />
                    </div>

                    <div className="form-group">
                        <label><UserIcon /> Farmer Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter Farmer Name"
                        />
                    </div>

                    <div className="form-group">
                        <label><PhoneIcon /> Phone No</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter Phone Number"
                            maxLength="10"
                        />
                    </div>

                    <div className="form-group">
                        <label><MailIcon /> Email No</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter Email Address"
                        />
                    </div>

                    <div className="form-group phone-pay-group">
                        <label><RupeeIcon /> Phone Pay No</label>
                        <input
                            type="text"
                            name="phonePay"
                            value={formData.phonePay}
                            onChange={handleChange}
                            placeholder="Enter Phone Pay Number"
                            maxLength="10"
                        />
                    </div>

                    <div className="form-buttons">
                        <button type="button" className="clear-button" onClick={handleClear}>
                            <RefreshIcon /> Clear
                        </button>
                        <button type="button" className="save-button" onClick={handleSave}>
                            <SaveIcon /> {editingId ? "Update" : "Save"}
                        </button>
                    </div>
                </div>

                {/* FARMERS TABLE SECTION */}
                <section className="farmers-section">
                    <div className="farmers-top">
                        <div className="farmers-heading">
                            <ListIcon />
                            <h2>Available Farmers</h2>
                        </div>

                        <div className="total-farmer-box">
                            <span className="total-farmer-icon">👥</span>
                            <span className="total-farmer-text">Total Farmer</span>
                            <span className="total-farmer-number">{farmers.length}</span>
                        </div>

                        <div className="search-box">
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Search by code or name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table className="farmer-table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Phone No</th>
                                    <th>Email No</th>
                                    <th>Phone Pay No</th>
                                    <th className="action-header">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFarmers.length > 0 ? (
                                    filteredFarmers.map((farmer) => (
                                        <tr key={farmer.id}>
                                            <td className="farmer-code">{farmer.code}</td>
                                            <td>{farmer.name}</td>
                                            <td>{farmer.phone}</td>
                                            <td>{farmer.email}</td>
                                            <td>{farmer.phonePay}</td>
                                            <td className="action-cell">
                                                <div className="action-buttons">
                                                    <button
                                                        type="button"
                                                        className="edit-button"
                                                        title="Update"
                                                        onClick={() => handleEdit(farmer)}
                                                    >
                                                        <EditIcon />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-button"
                                                        title="Delete"
                                                        onClick={() => handleDelete(farmer.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-data">
                                            No farmers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AddFarmer;