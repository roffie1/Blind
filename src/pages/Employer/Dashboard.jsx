import React, { useState, useEffect } from "react";
import "../../styles/employer.css";

function Dashboard({ setPage, setSelectedJob }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(stored);
  }, []);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + " minutes ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + " hours ago";
    return Math.floor(seconds / 86400) + " days ago";
  };

  const handleDelete = (index) => {
    const updated = jobs.filter((_, i) => i !== index);
    setJobs(updated);
    localStorage.setItem("jobs", JSON.stringify(updated));
  };

  return (
    <div className="employer-dashboard">

      <div className="dashboard-header">
        <h2>Employer Dashboard</h2>
      </div>

      <div className="dashboard-actions">
        <button onClick={() => setPage("post")} className="primary-btn">
          + Post a Job
        </button>

        <button onClick={() => setPage("applicants")} className="secondary-btn">
          View Applicants
        </button>
      </div>

      <div className="recent-section">
        <h3>Your Job Listings</h3>

        {jobs.length === 0 && <p>No jobs yet.</p>}

        {jobs.map((job, i) => (
          <div key={i} className="job-row">

            <div>
              <h4>{job.title}</h4>
              <p>{job.type} • {job.experience}</p>
              <small>Posted {timeAgo(job.createdAt)}</small>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
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
                className="secondary-btn"
                onClick={() => {
                  setSelectedJob(job);
                  setPage("post");
                }}
              >
                Edit
              </button>

              <button
                className="danger-btn"
                onClick={() => handleDelete(i)}
              >
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Dashboard;