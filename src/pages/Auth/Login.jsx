import React, { useState } from "react";
import "../../styles/login.css";

function Login({ setRole, setPage }) {
  const [role, setSelectedRole] = useState("employee");

  const handleLogin = () => {
    if (role === "employee") {
      setRole("employee");
      setPage("profile");
    } else {
      setRole("employer");
      setPage("dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1 className="logo">Blind Job System</h1>
        <p className="subtitle">
          Accessible Job Matching Platform
        </p>

        <div className="login-form">

          <input type="text" placeholder="Username or Email" />
          <input type="password" placeholder="Password" />

          {/* ✅ ROLE SELECTOR */}
          <select
            className="role-select"
            value={role}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="employee">Applicant</option>
            <option value="employer">Employer</option>
          </select>

          <button className="login-btn primary" onClick={handleLogin}>
            Login
          </button>

        </div>

        <div className="login-footer">
          <p>© 2026 Blind Job System</p>
        </div>

      </div>
    </div>
  );
}

export default Login;