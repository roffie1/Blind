import React, { useState, useEffect } from "react";
import "../styles/global.css";

function Navbar({ setPage, role, page }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(stored);
  }, []);

  // GLOBAL ADD FUNCTION
  window.addNotification = (notif) => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    const updated = [...stored, notif];
    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(updated);
  };

  const filtered = notifications.filter(n => n.role === role);

  return (
    <div className="navbar">
      <div className="nav-container">

        <div className="nav-left">
          <h2 className="logo">blind<span>jobs</span></h2>
        </div>

        <div className="nav-right">

          {role === "employee" && (
            <>
              <button onClick={() => setPage("profile")}>Profile</button>
              <button onClick={() => setPage("jobs")}>Job Search</button>
            </>
          )}

          {role === "employer" && (
            <>
              <button onClick={() => setPage("dashboard")}>Dashboard</button>
              <button onClick={() => setPage("post")}>Post Job</button>
              <button onClick={() => setPage("applicants")}>Applicants</button>
            </>
          )}

          {/* 🔔 NOTIFICATIONS */}
          <div
            className="notif-container"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <span style={{ cursor: "pointer" }}>🔔</span>

            {filtered.length > 0 && (
              <div className="notif-badge">{filtered.length}</div>
            )}

            {open && (
              <div className="notif-dropdown">

                {filtered.length === 0 && <p>No notifications</p>}

                {filtered.map((n, i) => (
                  <div
                    key={i}
                    className="notif-item"
                    onClick={() => {
                      // ✅ THIS IS THE IMPORTANT PART
                      if (n.page) {
                        setPage(n.page);
                      }
                    }}
                  >
                    {n.message}
                  </div>
                ))}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Navbar;