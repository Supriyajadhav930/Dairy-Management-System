import React, { useState } from "react";
import "./Add_farmer.css";

import farmerCodeImg from "../assets/Add_Farmer_img/farmercode.jpg.png";
import farmerNameImg from "../assets/Add_Farmer_img/farmername.jpg.png";
import phoneImg from "../assets/Add_Farmer_img/phone.jpg.png";
import gmailImg from "../assets/Add_Farmer_img/gmail.jpg.png";
import rupeesImg from "../assets/Add_Farmer_img/rupees.jpg.png";
import farmersImg from "../assets/Add_Farmer_img/farmers.jpg.png";
import searchImg from "../assets/Add_Farmer_img/search.jpg.png";
import saveImg from "../assets/Add_Farmer_img/save.jpg.png";
import arrowImg from "../assets/Add_Farmer_img/arrow.jpg.png";
import deleteImg from "../assets/Add_Farmer_img/delete.jpg.png";
import availableFarmerImg from "../assets/Add_Farmer_img/availablefarmer.jpg.png";

const initialFarmers = [
  {
    code: "1",
    name: "",
    phone: "",
    email: "",
    phonePay: "",
  },
  {
    code: "2",
    name: "",
    phone: "",
    email: "",
    phonePay: "",
  },
  {
    code: "3",
    name: "",
    phone: "",
    email: "",
    phonePay: "",
  },
  {
    code: "4",
    name: "",
    phone: "",
    email: "",
    phonePay: "",
  },
  {
    code: "5",
    name: "",
    phone: "",
    email: "",
    phonePay: "",
  },
];

function Add_Farmer() {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    phone: "",
    email: "",
    phonePay: "",
  });

  const [farmers, setFarmers] = useState(initialFarmers);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setFormData({
      code: "",
      name: "",
      phone: "",
      email: "",
      phonePay: "",
    });

    setEditIndex(null);
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      alert("Please enter Farmer Code and Farmer Name.");
      return;
    }

    if (editIndex !== null) {
      const updatedFarmers = [...farmers];

      updatedFarmers[editIndex] = {
        ...formData,
      };

      setFarmers(updatedFarmers);
      clearForm();
      return;
    }

    const existingFarmer = farmers.find(
      (farmer) =>
        farmer.code.toLowerCase() === formData.code.trim().toLowerCase()
    );

    if (existingFarmer) {
      alert("Farmer Code already exists.");
      return;
    }

    setFarmers((prev) => [
      ...prev,
      {
        code: formData.code.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        phonePay: formData.phonePay.trim(),
      },
    ]);

    clearForm();
  };

  const handleUpdate = (index) => {
    const farmer = farmers[index];

    setFormData({
      code: farmer.code,
      name: farmer.name,
      phone: farmer.phone,
      email: farmer.email,
      phonePay: farmer.phonePay,
    });

    setEditIndex(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (index) => {
    const farmer = farmers[index];

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${farmer.code}?`
    );

    if (!confirmDelete) {
      return;
    }

    setFarmers((prev) => prev.filter((_, i) => i !== index));

    if (editIndex === index) {
      clearForm();
    }
  };

  const filteredFarmers = farmers.filter((farmer) => {
    const searchText = search.toLowerCase();

    return (
      farmer.code.toLowerCase().includes(searchText) ||
      farmer.name.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="farmer-page">
      <main className="farmer-main-container">

        {/* ================= HEADER ================= */}
        <header className="farmer-header">
          <h1>Add Farmers</h1>

          <div className="header-decoration">
            <span></span>

            <img src={arrowImg} alt="Decoration" />

            <span></span>
          </div>
        </header>

        {/* ================= FORM SECTION ================= */}
        <section className="farmer-form-section">

          {/* Farmer Code */}
          <div className="farmer-field">
            <label>
              <img src={farmerCodeImg} alt="" />
              <span>Farmer Code</span>
            </label>

            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter Farmer Code"
            />
          </div>

          {/* Farmer Name */}
          <div className="farmer-field">
            <label>
              <img src={farmerNameImg} alt="" />
              <span>Farmer Name</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Farmer Name"
            />
          </div>

          {/* Phone */}
          <div className="farmer-field">
            <label>
              <img src={phoneImg} alt="" />
              <span>Phone No</span>
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
            />
          </div>

          {/* Email */}
          <div className="farmer-field">
            <label>
              <img src={gmailImg} alt="" />
              <span>Email No</span>
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email Address"
            />
          </div>

          {/* Phone Pay */}
          <div className="farmer-field phone-pay-field">
            <label>
              <img src={rupeesImg} alt="" />
              <span>Phone Pay No</span>
            </label>

            <input
              type="tel"
              name="phonePay"
              value={formData.phonePay}
              onChange={handleChange}
              placeholder="Enter Phone Pay Number"
            />
          </div>

          {/* Buttons */}
          <div className="form-buttons">

            <button
              type="button"
              className="clear-button"
              onClick={clearForm}
            >
              <span className="button-icon">↻</span>
              <span>Clear</span>
            </button>

            <button
              type="button"
              className="save-button"
              onClick={handleSave}
            >
              <img src={saveImg} alt="" />

              <span>
                {editIndex !== null ? "Update" : "Save"}
              </span>
            </button>

          </div>
        </section>

        {/* ================= AVAILABLE FARMERS ================= */}
        <section className="available-farmers-section">

          {/* Top row */}
          <div className="available-top-row">

            <div className="available-title">
              <img src={availableFarmerImg} alt="" />

              <h2>Available Farmers</h2>
            </div>

            <div className="total-farmer-box">
              <img src={farmersImg} alt="" />

              <span>Total Farmer</span>

              <strong>{farmers.length}</strong>
            </div>

            <div className="search-box">
              <img src={searchImg} alt="" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by code or name..."
              />
            </div>

          </div>

          {/* Table */}
          <div className="table-wrapper">

            <table className="farmers-table">

              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Phone No</th>
                  <th>Email No</th>
                  <th>Phone Pay No</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredFarmers.length > 0 ? (

                  filteredFarmers.map((farmer) => {

                    const actualIndex = farmers.findIndex(
                      (item) => item.code === farmer.code
                    );

                    return (
                      <tr key={farmer.code}>

                        <td className="farmer-code-cell">
                          {farmer.code}
                        </td>

                        <td>
                          {farmer.name || (
                            <span className="dash">−</span>
                          )}
                        </td>

                        <td>
                          {farmer.phone || (
                            <span className="dash">−</span>
                          )}
                        </td>

                        <td>
                          {farmer.email || (
                            <span className="dash">−</span>
                          )}
                        </td>

                        <td>
                          {farmer.phonePay || (
                            <span className="dash">−</span>
                          )}
                        </td>

                        {/* ACTION BUTTONS */}
                        <td className="action-cell">

                          <button
                            type="button"
                            className="update-button"
                            onClick={() =>
                              handleUpdate(actualIndex)
                            }
                          >
                            <span className="edit-icon">
                              ✎
                            </span>

                            <span>Update</span>
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleDelete(actualIndex)
                            }
                          >
                            <img
                              src={deleteImg}
                              alt=""
                            />

                            <span>Delete</span>
                          </button>

                        </td>

                      </tr>
                    );
                  })

                ) : (

                  <tr>
                    <td
                      colSpan="6"
                      className="no-farmer"
                    >
                      No farmers found
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Add_Farmer;