import React from "react";

function Dashboard({ setPage }) {
  return (
    <div style={{ padding: "30px" }}>

      <button onClick={() => setPage("profile")}>← Back</button>

      <h2>Employer Dashboard</h2>

      <button onClick={() => setPage("post")}>
        Post Job
      </button>

      <button onClick={() => setPage("applicants")}>
        View Applicants
      </button>
    </div>
  );
}

export default Dashboard;