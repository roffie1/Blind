import React, { useState, useEffect } from "react";
import "../../styles/employer.css";

function Applicants({ setPage }) {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // States for the new features
  const [actionType, setActionType] = useState(null); // 'accept' or 'reject'
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = () => {
    fetch("http://localhost:5000/api/applicants")
      .then((res) => res.json())
      .then((data) => setApplicants(data))
      .catch((err) => console.error("Error fetching applicants:", err));
  };

  // 🔥 Handle Accept/Reject with Message
  const handleSendDecision = async () => {
    try {
      await fetch(`http://localhost:5000/api/applicants/${selectedApplicant.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: actionType, message: message }),
      });

      alert(`Successfully sent ${actionType} notification to ${selectedApplicant.name}!`);
      
      // Reset view and refresh list
      setActionType(null);
      setMessage("");
      setSelectedApplicant(null);
      fetchApplicants();

    } catch (err) {
      console.error("Error updating applicant:", err);
    }
  };

  // 🔥 Handle Remove Applicant
  const handleRemove = async () => {
    try {
      await fetch(`http://localhost:5000/api/applicants/${selectedApplicant.id}`, {
        method: "DELETE",
      });

      // Reset view and refresh list
      setShowDeleteConfirm(false);
      setSelectedApplicant(null);
      fetchApplicants();
      
    } catch (err) {
      console.error("Error deleting applicant:", err);
    }
  };

  // Reset states when closing the applicant profile
  const closeProfile = () => {
    setSelectedApplicant(null);
    setActionType(null);
    setMessage("");
    setShowDeleteConfirm(false);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        
        {/* 🔥 VIEW 1: LIST OF APPLICANTS */}
        {!selectedApplicant ? (
          <>
            <button 
              className="primary-btn" 
              onClick={() => setPage("dashboard")} 
              style={{ marginBottom: "20px", width: "auto", padding: "10px 20px" }}
            >
              ← Back to Dashboard
            </button>
            
            <h2>Incoming Applicants</h2>
            
            <div className="job-list">
              {applicants.length === 0 ? (
                <p>No applicants found.</p>
              ) : (
                applicants.map((app) => (
                  <div 
                    key={app.id} 
                    className="job-card" 
                    onClick={() => setSelectedApplicant(app)}
                    style={{ cursor: "pointer", borderLeft: app.status === 'accept' ? "5px solid #28a745" : app.status === 'reject' ? "5px solid #dc3545" : "5px solid #0a66c2" }}
                  >
                    <div className="job-info">
                      <h4>{app.name} {app.status && `(${app.status.toUpperCase()})`}</h4>
                      <p><strong>Disability:</strong> {app.disability}</p>
                      <p><strong>Applied for:</strong> {app.appliedJobs?.length || 0} job(s)</p>
                      <p style={{ color: "#0a66c2", marginTop: "10px", fontSize: "14px", fontWeight: "bold" }}>
                        Click to view full details →
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          
          /* 🔥 VIEW 2: SINGLE APPLICANT DETAILS */
          <>
            <button 
              className="primary-btn" 
              onClick={closeProfile} 
              style={{ marginBottom: "20px", width: "auto", padding: "10px 20px", background: "#555" }}
            >
              ← Back to Applicant List
            </button>

            {/* Profile Card (Position Relative so Delete Button can be Absolute Top Right) */}
            <div className="profile-card" style={{ width: "100%", margin: "0", position: "relative" }}>
              
              {/* 🔥 REMOVE BUTTON (Top Right) */}
              {showDeleteConfirm ? (
                <div className="delete-confirm-popup">
                  <p>Are you sure you want to remove this applicant?</p>
                  <div>
                    <button className="confirm-btn" onClick={handleRemove}>Confirm</button>
                    <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="delete-app-btn" onClick={() => setShowDeleteConfirm(true)}>
                  🗑 Remove Applicant
                </button>
              )}

              <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", paddingRight: "150px" }}>
                {selectedApplicant.name}'s Profile
              </h2>
              
              <div style={{ marginTop: "20px", lineHeight: "2", fontSize: "16px" }}>
                <p><strong>Email:</strong> {selectedApplicant.email}</p>
                <p><strong>Phone:</strong> {selectedApplicant.phone}</p>
                <p><strong>Gender:</strong> {selectedApplicant.gender}</p>
                <p><strong>Location:</strong> {selectedApplicant.location}</p>
                <p><strong>Disability Type:</strong> {selectedApplicant.disability}</p>
                <p><strong>Skills:</strong> {selectedApplicant.skills}</p>
              </div>

              {/* APPLIED JOBS SECTION */}
              <div style={{ marginTop: "20px", background: "#f8f9fa", padding: "20px", borderRadius: "8px" }}>
                <h3 style={{ marginBottom: "15px", color: "#333" }}>Jobs Applied For:</h3>
                <ul style={{ paddingLeft: "20px", fontSize: "16px", margin: "0" }}>
                  {selectedApplicant.appliedJobs && selectedApplicant.appliedJobs.length > 0 ? (
                    selectedApplicant.appliedJobs.map((jobTitle, index) => (
                      <li key={index} style={{ marginBottom: "8px" }}>
                        <strong>{jobTitle}</strong>
                      </li>
                    ))
                  ) : (
                    <p>No jobs applied yet.</p>
                  )}
                </ul>
              </div>

              {/* 🔥 DECISION ACTIONS SECTION */}
              <div className="decision-section">
                {!actionType ? (
                  <>
                    <h3>Take Action</h3>
                    <div className="action-btn-group">
                      <button className="accept-btn" onClick={() => setActionType("accept")}>✅ Accept</button>
                      <button className="reject-btn" onClick={() => setActionType("reject")}>❌ Reject</button>
                    </div>
                  </>
                ) : (
                  <div className="message-box-container">
                    <h3>Write a message for {actionType === "accept" ? "Acceptance" : "Rejection"}</h3>
                    <textarea 
                      className="decision-message-box" 
                      placeholder={`Hello ${selectedApplicant.name}, ...`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="action-btn-group">
                      <button 
                        className={actionType === "accept" ? "accept-btn" : "reject-btn"}
                        onClick={handleSendDecision}
                      >
                        Send & {actionType === "accept" ? "Accept" : "Reject"}
                      </button>
                      <button className="cancel-btn" onClick={() => setActionType(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Applicants;