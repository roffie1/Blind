import React from "react";

function Sidebar({ setPage, role }) {
  return (
    <div className="sidebar">

      <h2 className="sidebar-title">Menu</h2>

      {role === "employee" && (
        <>
          <button onClick={() => setPage("profile")}>Profile</button>
          <button onClick={() => setPage("jobs")}>Find Jobs</button>
        </>
      )}

      {role === "employer" && (
        <>
          <button onClick={() => setPage("dashboard")}>Dashboard</button>
          <button onClick={() => setPage("post")}>Post Job</button>
          <button onClick={() => setPage("applicants")}>Applicants</button>
        </>
      )}

    </div>
  );
}

export default Sidebar;