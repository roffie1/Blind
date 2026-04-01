import React, { useState, useEffect } from "react";
import "../../styles/employer.css";

function Applicants({ setPage }) {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("applications")) || [];
    setApplicants(stored);
  }, []);

  return (
    <div className="employer-dashboard">

      <button
        className="secondary-btn"
        onClick={() => setPage("dashboard")}
      >
        ← Back
      </button>

      <h2 style={{ marginTop: "10px" }}>Applicants</h2>

      {!selectedApplicant &&
        applicants.map((app, i) => (
          <div
            key={i}
            className="applicant-card clickable"
            onClick={() => setSelectedApplicant(app)}
          >
            <h4>{app.name}</h4>
            <p>{app.location} • {app.impairment}</p>
            <small>Applied for: {app.jobTitle}</small>
          </div>
        ))}

      {selectedApplicant && (
        <div className="applicant-details">

          <button
            className="secondary-btn"
            onClick={() => setSelectedApplicant(null)}
          >
            ← Back
          </button>

          <h2>{selectedApplicant.name}</h2>

          <p><strong>Job:</strong> {selectedApplicant.jobTitle}</p>
          <p><strong>Location:</strong> {selectedApplicant.location}</p>
          <p><strong>Impairment:</strong> {selectedApplicant.impairment}</p>

        </div>
      )}

    </div>
  );
}

export default Applicants;