import React, { useState, useEffect } from "react";
import "../../styles/login.css";

function Login({ setRole, setPage }) {
  const [role, setSelectedRole] = useState("employee");
  const [impairment, setImpairment] = useState("blind");

  // 🔊 READ ON FOCUS
  useEffect(() => {
    const speak = (text) => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    };

    const handleFocus = (e) => {
      const text =
        e.target.getAttribute("data-speak") ||
        e.target.getAttribute("aria-label") ||
        e.target.placeholder ||
        e.target.innerText;

      if (text) speak(text);
    };

    document.addEventListener("focusin", handleFocus);

    return () => {
      document.removeEventListener("focusin", handleFocus);
    };
  }, []);

  const handleLogin = () => {
    localStorage.setItem("userImpairment", impairment);

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

        <h1
          className="logo"
          tabIndex="0"
          data-speak="Blind Job System login page"
        >
          Blind Job System
        </h1>

        <p
          className="subtitle"
          tabIndex="0"
          data-speak="Accessible Job Matching Platform"
        >
          Accessible Job Matching Platform
        </p>

        <div className="login-form">

          {/* USERNAME */}
          <input
            type="text"
            placeholder="Username or Email"
            tabIndex="0"
            data-speak="Enter username or email"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            tabIndex="0"
            data-speak="Enter password"
          />

          {/* ROLE */}
          <select
            className="role-select"
            value={role}
            onChange={(e) => setSelectedRole(e.target.value)}
            tabIndex="0"
            data-speak={`Select role. Current: ${role}`}
          >
            <option value="employee">Applicant</option>
            <option value="employer">Employer</option>
          </select>

          {/* IMPAIRMENT */}
          <select
            className="role-select"
            value={impairment}
            onChange={(e) => setImpairment(e.target.value)}
            tabIndex="0"
            data-speak={`Select visual impairment. Current: ${impairment}`}
          >
            <option value="blind">Blind</option>
            <option value="low-vision">Low Vision</option>
            <option value="color-blind">Color Blind</option>
          </select>

          {/* LOGIN BUTTON */}
          <button
            className="login-btn primary"
            onClick={handleLogin}
            tabIndex="0"
            data-speak="Press to login"
          >
            Login
          </button>

        </div>

        <div
          className="login-footer"
          tabIndex="0"
          data-speak="Footer information"
        >
          <p>© 2026 Blind Job System</p>
        </div>

      </div>
    </div>
  );
}

export default Login;