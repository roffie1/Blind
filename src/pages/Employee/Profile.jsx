import React, { useState } from "react";
import "../../styles/employee.css";

function Profile({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    communication: "",
    impairment: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-container">

      <div className="profile-card">

        <h2>Build Your Profile</h2>
        <p className="subtitle">
          Provide your details so we can match you with suitable jobs
        </p>

        <label>Full Name</label>
        <input
          name="name"
          placeholder="Enter your full name"
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
        />

        <label>Phone</label>
        <input
          name="phone"
          placeholder="Enter your phone number"
          onChange={handleChange}
        />

        <label>Location (Optional)</label>
        <input
          name="location"
          placeholder="City / Country"
          onChange={handleChange}
        />

        <label>Preferred Communication Method</label>
        <select name="communication" onChange={handleChange}>
          <option value="">Select</option>
          <option value="call">Phone Call</option>
          <option value="email">Email</option>
          <option value="text">Text Message</option>
        </select>

        <label>Type of Visual Impairment</label>
        <select name="impairment" onChange={handleChange}>
          <option value="">Select</option>
          <option value="blind">Blind</option>
          <option value="low-vision">Low Vision</option>
          <option value="color-blind">Color Blind</option>
        </select>

        {/* ✅ ADDED RESUME UPLOAD */}
        <label>Upload Resume</label>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              localStorage.setItem("resumeName", file.name);
            }
          }}
        />

        <button
  className="primary-btn"
  onClick={() => {
    localStorage.setItem("applicantData", JSON.stringify(form));
    setPage("jobs");
  }}
>
  Save & Find Jobs
</button>

      </div>

    </div>
  );
}

export default Profile;