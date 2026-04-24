import React, { useState, useEffect } from "react";
import "../../styles/employer.css";

function Dashboard({ setPage, setSelectedJob }) {
  const [jobs, setJobs] = useState([]);
  const [employerName, setEmployerName] = useState("");
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const storedJobs =
      JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(storedJobs);

    // ✅ GET EMPLOYER NAME
    const name = localStorage.getItem("employerName") || "Employer";
    setEmployerName(name);

    // ✅ GET APPLICANTS (or dummy if none yet)
    const storedApplicants =
      JSON.parse(localStorage.getItem("applicants")) || [
        { name: "Juan Applicant" },
        { name: "Maria Santos" },
        { name: "Pedro Reyes" }
      ];
    setApplicants(storedApplicants);
  }, []);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + " mins ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + " hrs ago";
    return Math.floor(seconds / 86400) + " days ago";
  };

  const handleDelete = (index) => {
    const updated = jobs.filter((_, i) => i !== index);
    setJobs(updated);
    localStorage.setItem("jobs", JSON.stringify(updated));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">

        {/* ✅ DYNAMIC NAME */}
        <h2 className="welcome-text">
          WELCOME TO <span>BLINDJOBS</span>, {employerName}
        </h2>

        <div className="dashboard-grid">

          {/* ✅ APPLICANTS (DYNAMIC) */}
          <div className="applicants-box">
            <h3>Incoming applicants</h3>

            {applicants.length === 0 ? (
              <p>No applicants yet</p>
            ) : (
              applicants.map((app, i) => (
                <p key={i}>{app.name}</p>
              ))
            )}
          </div>

          {/* RIGHT SIDE */}
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

              {jobs.map((job, i) => (
                <div key={i} className="job-card">

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
                        setSelectedJob({ ...job, index: i });
                        setPage("post");
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(i)}
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