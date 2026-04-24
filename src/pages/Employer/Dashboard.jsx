import React, { useState, useEffect } from "react";
import "../../styles/employer.css";

function Dashboard({ setPage, setSelectedJob }) {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));

    fetch("http://localhost:5000/api/applicants")
      .then((res) => res.json())
      .then((data) => setApplicants(data))
      .catch((err) => console.error("Error fetching applicants:", err));
  }, []);

  const timeAgo = (date) => {
    if (!date) return "Just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + " mins ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + " hrs ago";
    return Math.floor(seconds / 86400) + " days ago";
  };

  // ✅ Talk to the backend to delete the job
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: "DELETE",
      });
      // Remove it locally from the screen so we don't have to refresh
      setJobs(jobs.filter(job => job.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        
        <h2 className="welcome-text">
          WELCOME TO <span>BLINDJOBS</span>, Employer
        </h2>

        <div className="dashboard-grid">
          
          <div 
            className="applicants-box" 
            style={{ cursor: "pointer", transition: "0.2s" }}
            onClick={() => setPage("applicants")}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f0f8ff"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}
          >
            <h3>Incoming applicants</h3>
            {applicants.length === 0 ? (
              <p>No applicants yet.</p>
            ) : (
              <p style={{ color: "#0a66c2", fontWeight: "bold" }}>
                You have {applicants.length} applicant(s). Click to view.
              </p>
            )}
          </div>

          <div className="jobs-section">
            <div className="action-bar">
              <h3>Your Job Listings</h3>
              <button
                className="primary-btn"
                onClick={() => {
                  setSelectedJob(null);
                  setPage("post");
                }}
              >
                + Post a Job
              </button>
            </div>

            <div className="job-list">
              {jobs.length === 0 && (
                <div className="empty-state">
                  <p>No jobs posted yet.</p>
                </div>
              )}

              {jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-info">
                    <h4>{job.title}</h4>
                    <p className="job-meta">
                      {job.type} • {job.experience}
                    </p>
                    <span className="job-time">
                      Posted {timeAgo(job.createdAt)}
                    </span>
                  </div>

                  <div className="job-actions">
                    <button
                      className="view-btn"
                      onClick={() => {
                        setSelectedJob(job);
                        setPage("jobdetails");
                      }}
                    >
                      View
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedJob(job); // ✅ Pass the full job object (including ID)
                        setPage("post");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(job.id)} // ✅ Pass actual Job ID
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;