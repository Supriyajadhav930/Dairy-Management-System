import React, { useRef, useState } from "react";
import "./Add_farmer.css";

import farmerCodeImg from "../assets/Add_Farmer_img/farmercode.jpg";
import farmerNameImg from "../assets/Add_Farmer_img/farmername.jpg";
import phoneImg from "../assets/Add_Farmer_img/phone.jpg";
import gmailImg from "../assets/Add_Farmer_img/gmail.jpg";
import rupeesImg from "../assets/Add_Farmer_img/rupees.jpg";
import farmersImg from "../assets/Add_Farmer_img/farmers.jpg";
import availableFarmerImg from "../assets/Add_Farmer_img/availablefarmer.jpg";
import searchImg from "../assets/Add_Farmer_img/search.jpg";
import saveImg from "../assets/Add_Farmer_img/save.jpg";
import deleteImg from "../assets/Add_Farmer_img/delete.jpg";
import arrowImg from "../assets/Add_Farmer_img/arrow.jpg";

const Add_Farmer = () => {
  const [farmerCode, setFarmerCode] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [phonePay, setPhonePay] = useState("");
  const [search, setSearch] = useState("");

  // Used to know whether we are updating an existing farmer
  const [editingCode, setEditingCode] = useState(null);

  // Validation messages
  const [errors, setErrors] = useState({});

  // References for Enter-key navigation
  const farmerCodeRef = useRef(null);
  const farmerNameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const phonePayRef = useRef(null);

  // Farmers will now be added using the code entered by you
  const [farmers, setFarmers] = useState([]);

  /* =========================================================
     CLEAR FORM
     ========================================================= */

  const clearForm = () => {
    setFarmerCode("");
    setFarmerName("");
    setPhone("");
    setEmail("");
    setPhonePay("");
    setEditingCode(null);
    setErrors({});

    // Put cursor back into Farmer Code
    setTimeout(() => {
      farmerCodeRef.current?.focus();
    }, 0);
  };

  /* =========================================================
     VALIDATION
     ========================================================= */

  const validateForm = () => {
    const newErrors = {};

    // Farmer Code
    if (!farmerCode.trim()) {
      newErrors.farmerCode = "Farmer code is required.";
    }

    // Farmer Name
    const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

    if (!farmerName.trim()) {
      newErrors.farmerName = "Farmer name is required.";
    } else if (!namePattern.test(farmerName.trim())) {
      newErrors.farmerName =
        "Name should contain letters and spaces only.";
    }

    // Mobile Number
    const phonePattern = /^[0-9]{10}$/;

    if (!phone.trim()) {
      newErrors.phone = "Mobile number is required.";
    } else if (!phonePattern.test(phone)) {
      newErrors.phone = "Mobile number must contain exactly 10 digits.";
    }

    // Gmail
    const gmailPattern = /^[a-z0-9]+@gmail\.com$/;

    if (!email.trim()) {
      newErrors.email = "Gmail is required.";
    } else if (!gmailPattern.test(email)) {
      newErrors.email =
        "Enter Gmail in format: abc123@gmail.com";
    }

    // Phone Pay
    if (!phonePay.trim()) {
      newErrors.phonePay = "Phone Pay number is required.";
    } else if (!phonePattern.test(phonePay)) {
      newErrors.phonePay =
        "Phone Pay number must contain exactly 10 digits.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================================================
     SAVE / UPDATE FARMER
     ========================================================= */

  const saveFarmer = () => {
    if (!validateForm()) {
      return;
    }

    const trimmedCode = farmerCode.trim();

    // Check duplicate code when adding a new farmer
    const duplicateCode = farmers.some(
      (farmer) =>
        farmer.code.toLowerCase() === trimmedCode.toLowerCase() &&
        farmer.code !== editingCode
    );

    if (duplicateCode) {
      setErrors({
        farmerCode: "This farmer code already exists.",
      });

      setTimeout(() => {
        farmerCodeRef.current?.focus();
      }, 0);

      return;
    }

    const farmerData = {
      code: trimmedCode,
      name: farmerName.trim(),
      phone: phone,
      email: email,
      phonePay: phonePay,
    };

    /* ================= UPDATE ================= */

    if (editingCode !== null) {
      setFarmers((prev) =>
        prev.map((farmer) =>
          farmer.code === editingCode ? farmerData : farmer
        )
      );
    }

    /* ================= ADD NEW ================= */

    else {
      setFarmers((prev) => [...prev, farmerData]);
    }

    clearForm();
  };

  /* =========================================================
     DELETE FARMER
     ========================================================= */

  const deleteFarmer = (code) => {
    setFarmers((prev) =>
      prev.filter((farmer) => farmer.code !== code)
    );

    // If deleted farmer is currently being edited
    if (editingCode === code) {
      clearForm();
    }
  };

  /* =========================================================
     UPDATE FARMER
     ========================================================= */

  const updateFarmer = (farmer) => {
    setFarmerCode(farmer.code);
    setFarmerName(farmer.name);
    setPhone(farmer.phone);
    setEmail(farmer.email);
    setPhonePay(farmer.phonePay);

    // Remember which farmer is being updated
    setEditingCode(farmer.code);

    setErrors({});

    // Cursor goes to Farmer Code
    setTimeout(() => {
      farmerCodeRef.current?.focus();
    }, 0);
  };

  /* =========================================================
     ENTER KEY NAVIGATION
     ========================================================= */

  const handleEnter = (event, nextRef, action) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (action) {
        action();
        return;
      }

      nextRef?.current?.focus();
    }
  };

  /* =========================================================
     PHONE VALIDATION INPUT
     Only digits and maximum 10
     ========================================================= */

  const handlePhoneChange = (value, setter) => {
    const digitsOnly = value.replace(/\D/g, "");

    setter(digitsOnly.slice(0, 10));
  };

  /* =========================================================
     GMAIL INPUT
     Only lowercase letters and numbers
     ========================================================= */

  const handleEmailChange = (value) => {
    // Convert uppercase to lowercase
    const lowerValue = value.toLowerCase();

    // Allow only a-z, 0-9, @ and .
    const cleanedValue = lowerValue.replace(
      /[^a-z0-9@.]/g,
      ""
    );

    setEmail(cleanedValue);
  };

  /* =========================================================
     SEARCH
     ========================================================= */

  const filteredFarmers = farmers.filter((farmer) => {
    const value = search.toLowerCase();

    return (
      farmer.code.toLowerCase().includes(value) ||
      farmer.name.toLowerCase().includes(value)
    );
  });

  return (
    <div className="add-farmer-page">
      <div className="add-farmer-main">

        {/* ================= HEADER ================= */}

        <div className="add-farmer-header">
          <h1>Add Farmers</h1>

          <div className="header-decoration">
            <span></span>
            <div className="leaf-icon">⌁</div>
            <span></span>
          </div>
        </div>


        {/* ================= FORM CARD ================= */}

        <div className="farmer-form-card">

          {/* ================= FARMER CODE ================= */}

          <div className="input-group">

            <div className="input-label">
              <img src={farmerCodeImg} alt="" />
              <span>Farmer Code</span>
            </div>

            <input
              ref={farmerCodeRef}
              type="text"
              placeholder="Enter Farmer Code"
              value={farmerCode}
              onChange={(e) => {
                setFarmerCode(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  farmerCode: "",
                }));
              }}
              onKeyDown={(e) =>
                handleEnter(e, farmerNameRef)
              }
            />

            {errors.farmerCode && (
              <div className="validation-error">
                {errors.farmerCode}
              </div>
            )}

          </div>


          {/* ================= FARMER NAME ================= */}

          <div className="input-group">

            <div className="input-label">
              <img src={farmerNameImg} alt="" />
              <span>Farmer Name</span>
            </div>

            <input
              ref={farmerNameRef}
              type="text"
              placeholder="Enter Farmer Name"
              value={farmerName}
              onChange={(e) => {
                setFarmerName(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  farmerName: "",
                }));
              }}
              onKeyDown={(e) =>
                handleEnter(e, phoneRef)
              }
            />

            {errors.farmerName && (
              <div className="validation-error">
                {errors.farmerName}
              </div>
            )}

          </div>


          {/* ================= PHONE ================= */}

          <div className="input-group">

            <div className="input-label">
              <img src={phoneImg} alt="" />
              <span>Phone No</span>
            </div>

            <input
              ref={phoneRef}
              type="text"
              inputMode="numeric"
              maxLength="10"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => {
                handlePhoneChange(
                  e.target.value,
                  setPhone
                );

                setErrors((prev) => ({
                  ...prev,
                  phone: "",
                }));
              }}
              onKeyDown={(e) =>
                handleEnter(e, emailRef)
              }
            />

            {errors.phone && (
              <div className="validation-error">
                {errors.phone}
              </div>
            )}

          </div>


          {/* ================= EMAIL ================= */}

          <div className="input-group">

            <div className="input-label">
              <img src={gmailImg} alt="" />
              <span>Email No</span>
            </div>

            <input
              ref={emailRef}
              type="text"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => {
                handleEmailChange(e.target.value);

                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }}
              onKeyDown={(e) =>
                handleEnter(e, phonePayRef)
              }
            />

            {errors.email && (
              <div className="validation-error">
                {errors.email}
              </div>
            )}

          </div>


          {/* ================= PHONE PAY ================= */}

          <div className="input-group phone-pay-group">

            <div className="input-label">
              <img src={rupeesImg} alt="" />
              <span>Phone Pay No</span>
            </div>

            <input
              ref={phonePayRef}
              type="text"
              inputMode="numeric"
              maxLength="10"
              placeholder="Enter Phone Pay Number"
              value={phonePay}
              onChange={(e) => {
                handlePhoneChange(
                  e.target.value,
                  setPhonePay
                );

                setErrors((prev) => ({
                  ...prev,
                  phonePay: "",
                }));
              }}
              onKeyDown={(e) =>
                handleEnter(e, null, saveFarmer)
              }
            />

            {errors.phonePay && (
              <div className="validation-error">
                {errors.phonePay}
              </div>
            )}

          </div>


          {/* ================= BUTTONS ================= */}

          <div className="form-buttons">

            <button
              type="button"
              className="clear-btn"
              onClick={clearForm}
            >
              <img src={arrowImg} alt="" />
              <span>Clear</span>
            </button>


            <button
              type="button"
              className="save-btn"
              onClick={saveFarmer}
            >
              <img src={saveImg} alt="" />

              <span>
                {editingCode !== null ? "Save" : "Save"}
              </span>

            </button>

          </div>

        </div>


        {/* ================= AVAILABLE FARMERS ================= */}

        <div className="available-farmers-card">

          {/* ================= TOP SECTION ================= */}

          <div className="available-header">

            <div className="available-title">
              <img
                src={availableFarmerImg}
                alt=""
              />

              <span>Available Farmers</span>
            </div>


            <div className="total-farmer-box">

              <img
                src={farmersImg}
                alt=""
              />

              <span>Total Farmer</span>

              <strong>
                {farmers.length}
              </strong>

            </div>


            <div className="search-box">

              <img
                src={searchImg}
                alt=""
              />

              <input
                type="text"
                placeholder="Search by code or name..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>


          {/* ================= TABLE ================= */}

          <div className="farmer-table-wrapper">

            <table className="farmer-table">

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

                {filteredFarmers.map((farmer) => (

                  <tr key={farmer.code}>

                    <td>
                      {farmer.code}
                    </td>

                    <td>
                      {farmer.name
                        ? farmer.name
                        : "–"}
                    </td>

                    <td>
                      {farmer.phone
                        ? farmer.phone
                        : "–"}
                    </td>

                    <td>
                      {farmer.email
                        ? farmer.email
                        : "–"}
                    </td>

                    <td>
                      {farmer.phonePay
                        ? farmer.phonePay
                        : "–"}
                    </td>

                    <td>

                      <div className="action-buttons">

                        {/* UPDATE */}

                        <button
                          type="button"
                          className="update-btn"
                          onClick={() =>
                            updateFarmer(farmer)
                          }
                          title="Update"
                        >
                          <span className="edit-symbol">
                            ✎
                          </span>
                        </button>


                        {/* DELETE */}

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            deleteFarmer(
                              farmer.code
                            )
                          }
                          title="Delete"
                        >
                          <img
                            src={deleteImg}
                            alt="Delete"
                          />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Add_Farmer;