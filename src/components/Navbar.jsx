import React, { useState, useEffect } from "react";
import "../styles/global.css";

function Navbar({ setPage, role, page, setSelectedJob }) {
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

        {/* LEFT */}
        <div className="nav-left">
          <h2
            className="logo"
            tabIndex="0"
            data-speak="Blind Jobs Home"
          >
            blind<span>jobs</span>
          </h2>
        </div>

        {/* RIGHT */}
        <div className="nav-right">

          {role === "employee" && (
            <>
              <button
                tabIndex="0"
                data-speak="Go to profile"
                onClick={() => setPage("profile")}
                onKeyDown={(e) => e.key === "Enter" && setPage("profile")}
              >
                Profile
              </button>

              <button
                tabIndex="0"
                data-speak="Go to job search"
                onClick={() => setPage("jobs")}
                onKeyDown={(e) => e.key === "Enter" && setPage("jobs")}
              >
                Job Search
              </button>
            </>
          )}

          {role === "employer" && (
            <>
              <button
                tabIndex="0"
                data-speak="Go to dashboard"
                onClick={() => setPage("dashboard")}
                onKeyDown={(e) => e.key === "Enter" && setPage("dashboard")}
              >
                Dashboard
              </button>

              {/* ✅ FIX IS HERE */}
              <button
                tabIndex="0"
                data-speak="Post a job"
                onClick={() => {
                  setSelectedJob(null); // ✅ RESET EDIT MODE
                  setPage("post");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSelectedJob(null); // ✅ ALSO RESET HERE
                    setPage("post");
                  }
                }}
              >
                Post Job
              </button>

              <button
                tabIndex="0"
                data-speak="View applicants"
                onClick={() => setPage("applicants")}
                onKeyDown={(e) => e.key === "Enter" && setPage("applicants")}
              >
                Applicants
              </button>
            </>
          )}

          {/* 🔔 NOTIFICATIONS */}
          <div
            className="notif-container"
            tabIndex="0"
            data-speak={`Notifications. You have ${filtered.length} notifications`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <span>🔔</span>

            {filtered.length > 0 && (
              <div className="notif-badge">{filtered.length}</div>
            )}

            {open && (
              <div className="notif-dropdown">

                {filtered.length === 0 && (
                  <p tabIndex="0" data-speak="No notifications">
                    No notifications
                  </p>
                )}

                {filtered.map((n, i) => (
                  <div
                    key={i}
                    className="notif-item"
                    tabIndex="0"
                    data-speak={n.message}
                    onClick={() => {
                      if (n.page) setPage(n.page);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && n.page) {
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