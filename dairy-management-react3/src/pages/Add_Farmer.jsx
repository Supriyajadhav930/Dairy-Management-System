import React, { useRef, useState } from "react";
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

const AddFarmer = () => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    phone: "",
    email: "",
    phonePay: "",
  });

  const [errors, setErrors] = useState({
    code: "",
    name: "",
    phone: "",
    email: "",
    phonePay: "",
  });

  const [farmers, setFarmers] = useState(initialFarmers);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const codeRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const phonePayRef = useRef(null);

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  const validateField = (field, value) => {
    const trimmedValue = value.trim();

    switch (field) {
      case "code":
        if (!trimmedValue) {
          return "Please enter Farmer Code.";
        }

        // Whole number only
        if (!/^\d+$/.test(trimmedValue)) {
          return "Farmer Code must be a whole number.";
        }

        return "";

      case "name":
        if (!trimmedValue) {
          return "Please enter Farmer Name.";
        }

        // Letters and spaces only
        if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(trimmedValue)) {
          return "Farmer Name should contain letters only.";
        }

        return "";

      case "phone":
        if (!trimmedValue) {
          return "Please enter Phone Number.";
        }

        if (!/^\d{10}$/.test(trimmedValue)) {
          return "Phone Number must be exactly 10 digits.";
        }

        return "";

      case "email":
        if (!trimmedValue) {
          return "Please enter Email Address.";
        }

        // Lowercase Gmail address only
        if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(trimmedValue)) {
          return "Email must be lowercase and end with @gmail.com.";
        }

        return "";

      case "phonePay":
        if (!trimmedValue) {
          return "Please enter Phone Pay Number.";
        }

        if (!/^\d{10}$/.test(trimmedValue)) {
          return "Phone Pay Number must be exactly 10 digits.";
        }

        return "";

      default:
        return "";
    }
  };

  // --------------------------------------------------
  // HANDLE INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Farmer Code
    if (name === "code") {
      newValue = value;

      if (value !== "" && !/^\d*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          code: "Farmer Code must be a whole number.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          code: "",
        }));
      }
    }

    // Farmer Name
    if (name === "name") {
      newValue = value.replace(/[^A-Za-z ]/g, "");
      newValue = newValue.replace(/\s{2,}/g, " ");

      setErrors((prev) => ({
        ...prev,
        name: "",
      }));
    }

    // Phone
    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 10);

      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }

    // Phone Pay
    if (name === "phonePay") {
      newValue = value.replace(/\D/g, "").slice(0, 10);

      setErrors((prev) => ({
        ...prev,
        phonePay: "",
      }));
    }

    // Email
    if (name === "email") {
      newValue = value;

      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // --------------------------------------------------
  // ENTER KEY NAVIGATION
  // --------------------------------------------------

  const handleKeyDown = (e, field) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const error = validateField(field, formData[field]);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
      return;
    }

    if (field === "code") {
      nameRef.current?.focus();
    }

    if (field === "name") {
      phoneRef.current?.focus();
    }

    if (field === "phone") {
      emailRef.current?.focus();
    }

    if (field === "email") {
      phonePayRef.current?.focus();
    }

    if (field === "phonePay") {
      handleSave();
    }
  };

  // --------------------------------------------------
  // VALIDATE COMPLETE FORM
  // --------------------------------------------------

  const validateForm = () => {
    const newErrors = {
      code: validateField("code", formData.code),
      name: validateField("name", formData.name),
      phone: validateField("phone", formData.phone),
      email: validateField("email", formData.email),
      phonePay: validateField("phonePay", formData.phonePay),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  // --------------------------------------------------
  // SAVE FARMER
  // --------------------------------------------------

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const code = formData.code.trim();

    // Check duplicate farmer code
    const duplicateIndex = farmers.findIndex(
      (farmer, index) =>
        farmer.code === code && index !== editIndex
    );

    if (duplicateIndex !== -1) {
      setErrors((prev) => ({
        ...prev,
        code: "This Farmer Code already exists.",
      }));

      codeRef.current?.focus();
      return;
    }

    if (editIndex !== null) {
      // Update existing farmer
      setFarmers((prev) =>
        prev.map((farmer, index) =>
          index === editIndex
            ? {
                ...formData,
                code: formData.code.trim(),
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                phonePay: formData.phonePay.trim(),
              }
            : farmer
        )
      );

      setEditIndex(null);
    } else {
      // Add new farmer
      setFarmers((prev) => [
        ...prev,
        {
          ...formData,
          code: formData.code.trim(),
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          phonePay: formData.phonePay.trim(),
        },
      ]);
    }

    handleClear();
  };

  // --------------------------------------------------
  // CLEAR FORM
  // --------------------------------------------------

  const handleClear = () => {
    setFormData({
      code: "",
      name: "",
      phone: "",
      email: "",
      phonePay: "",
    });

    setErrors({
      code: "",
      name: "",
      phone: "",
      email: "",
      phonePay: "",
    });

    setEditIndex(null);

    setTimeout(() => {
      codeRef.current?.focus();
    }, 0);
  };

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  const handleUpdate = (index) => {
    const farmer = farmers[index];

    setFormData({
      code: farmer.code || "",
      name: farmer.name || "",
      phone: farmer.phone || "",
      email: farmer.email || "",
      phonePay: farmer.phonePay || "",
    });

    setErrors({
      code: "",
      name: "",
      phone: "",
      email: "",
      phonePay: "",
    });

    setEditIndex(index);

    setTimeout(() => {
      codeRef.current?.focus();
    }, 0);
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = (index) => {
    setFarmers((prev) =>
      prev.filter((_, farmerIndex) => farmerIndex !== index)
    );

    if (editIndex === index) {
      handleClear();
    } else if (editIndex !== null && editIndex > index) {
      setEditIndex((prev) => prev - 1);
    }
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredFarmers = farmers.filter((farmer) => {
    const searchValue = search.toLowerCase();

    return (
      farmer.code.toLowerCase().includes(searchValue) ||
      farmer.name.toLowerCase().includes(searchValue) ||
      farmer.phone.toLowerCase().includes(searchValue) ||
      farmer.email.toLowerCase().includes(searchValue) ||
      farmer.phonePay.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="farmer-page">
      <div className="farmer-main-container">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="farmer-header">
          <div className="farmer-header-left">
            <img
              src={farmersImg}
              alt="Farmers"
              className="farmer-header-icon"
            />

            <div>
              <h1>Add Farmer</h1>
              <p>Register and manage farmer details</p>
            </div>
          </div>
        </div>

        {/* ==========================================
            FORM SECTION
        ========================================== */}

        <div className="farmer-form-section">

          {/* LEFT COLUMN */}

          <div className="farmer-form-column">

            {/* FARMER CODE */}

            <div className="farmer-field">
              <label>
                <img src={farmerCodeImg} alt="" />
                Farmer Code
              </label>

              <input
                ref={codeRef}
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, "code")}
                placeholder="Enter Farmer Code"
                autoComplete="off"
                inputMode="numeric"
              />

              {errors.code && (
                <span className="field-error">
                  {errors.code}
                </span>
              )}
            </div>

            {/* FARMER NAME */}

            <div className="farmer-field">
              <label>
                <img src={farmerNameImg} alt="" />
                Farmer Name
              </label>

              <input
                ref={nameRef}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, "name")}
                placeholder="Enter Farmer Name"
                autoComplete="off"
              />

              {errors.name && (
                <span className="field-error">
                  {errors.name}
                </span>
              )}
            </div>

            {/* PHONE */}

            <div className="farmer-field">
              <label>
                <img src={phoneImg} alt="" />
                Phone No
              </label>

              <input
                ref={phoneRef}
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, "phone")}
                placeholder="Enter Phone Number"
                autoComplete="off"
                inputMode="numeric"
                maxLength={10}
              />

              {errors.phone && (
                <span className="field-error">
                  {errors.phone}
                </span>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN */}

          <div className="farmer-form-column">

            {/* EMAIL */}

            <div className="farmer-field">
              <label>
                <img src={gmailImg} alt="" />
                Email Address
              </label>

              <input
                ref={emailRef}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, "email")}
                placeholder="Enter Gmail Address"
                autoComplete="off"
              />

              {errors.email && (
                <span className="field-error">
                  {errors.email}
                </span>
              )}
            </div>

            {/* PHONE PAY */}

            <div className="farmer-field">
              <label>
                <img src={rupeesImg} alt="" />
                Phone Pay No
              </label>

              <input
                ref={phonePayRef}
                type="text"
                name="phonePay"
                value={formData.phonePay}
                onChange={handleChange}
                onKeyDown={(e) =>
                  handleKeyDown(e, "phonePay")
                }
                placeholder="Enter Phone Pay Number"
                autoComplete="off"
                inputMode="numeric"
                maxLength={10}
              />

              {errors.phonePay && (
                <span className="field-error">
                  {errors.phonePay}
                </span>
              )}
            </div>

          </div>
        </div>

        {/* ==========================================
            BUTTONS
        ========================================== */}

        <div className="farmer-form-buttons">

          <button
            type="button"
            className="farmer-action-button save-button"
            onClick={handleSave}
          >
            <img src={saveImg} alt="" />
            {editIndex !== null ? "Update" : "Save"}
          </button>

          <button
            type="button"
            className="farmer-action-button clear-button"
            onClick={handleClear}
          >
            Clear
          </button>

        </div>

        {/* ==========================================
            AVAILABLE FARMERS
        ========================================== */}

        <div className="available-farmers-section">

          <div className="available-farmers-header">

            <div className="available-title">
              <img
                src={availableFarmerImg}
                alt=""
              />

              <div>
                <h2>Available Farmers</h2>
                <p>View and manage registered farmers</p>
              </div>
            </div>

            <div className="total-farmer-box">
              <span>Total Farmer</span>
              <strong>{farmers.length}</strong>
            </div>

          </div>

          {/* SEARCH */}

          <div className="farmer-search-container">

            <div className="farmer-search-box">

              <img
                src={searchImg}
                alt="Search"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search Farmer"
                autoComplete="off"
              />

            </div>

          </div>

          {/* ==========================================
              TABLE
          ========================================== */}

          <div className="farmer-table-wrapper">

            <table className="farmer-table">

              <thead>
                <tr>
                  <th>Farmer Code</th>
                  <th>Farmer Name</th>
                  <th>Phone No</th>
                  <th>Email Address</th>
                  <th>Phone Pay No</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredFarmers.length > 0 ? (
                  filteredFarmers.map((farmer) => {

                    const actualIndex =
                      farmers.findIndex(
                        (item) =>
                          item === farmer
                      );

                    return (
                      <tr key={actualIndex}>

                        <td>
                          {farmer.code}
                        </td>

                        <td>
                          {farmer.name || "-"}
                        </td>

                        <td>
                          {farmer.phone || "-"}
                        </td>

                        <td>
                          {farmer.email || "-"}
                        </td>

                        <td>
                          {farmer.phonePay || "-"}
                        </td>

                        <td>

                          <div className="table-action-buttons">

                            <button
                              type="button"
                              className="update-button"
                              onClick={() =>
                                handleUpdate(
                                  actualIndex
                                )
                              }
                            >
                              Update
                            </button>

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() =>
                                handleDelete(
                                  actualIndex
                                )
                              }
                            >
                              <img
                                src={deleteImg}
                                alt=""
                              />
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="no-farmer-row"
                    >
                      No farmers found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ==========================================
            BOTTOM DECORATION
        ========================================== */}

        <div className="farmer-bottom-decoration">
          <img
            src={arrowImg}
            alt=""
          />
        </div>

      </div>
    </div>
  );
};

export default AddFarmer;