import React, { useState, useEffect } from "react";
import "../../styles/employer.css";

function JobDetails({ job, setPage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(job);

  useEffect(() => {
    setEditedJob(job);
  }, [job]);

  if (!job) return <p>No job selected.</p>;

  const handleChange = (e) => {
    setEditedJob({
      ...editedJob,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="employer-dashboard">

      <button
        className="secondary-btn"
        onClick={() => setPage("dashboard")}
      >
        ← Back
      </button>

      <div className="recent-section" style={{ marginTop: "20px" }}>

        {isEditing ? (
          <div className="edit-form">

            <h2>Edit Job</h2>

            {/* TITLE */}
            <div className="form-group">
              <label>Job Title</label>
              <input
                name="title"
                value={editedJob.title}
                onChange={handleChange}
              />
            </div>

            {/* TYPE */}
            <div className="form-group">
              <label>Job Type</label>
              <select
                name="type"
                value={editedJob.type}
                onChange={handleChange}
              >
                <option>Remote</option>
                <option>On-site</option>
              </select>
            </div>

            {/* EXPERIENCE */}
            <div className="form-group">
              <label>Experience Level</label>
              <select
                name="experience"
                value={editedJob.experience}
                onChange={handleChange}
              >
                <option>Entry Level</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={editedJob.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* BUTTONS */}
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                className="primary-btn"
                onClick={() => setIsEditing(false)}
              >
                Save Changes
              </button>

              <button
                className="secondary-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        ) : (
          <>
            <h2>{editedJob.title}</h2>

            <p><strong>Type:</strong> {editedJob.type}</p>
            <p><strong>Experience:</strong> {editedJob.experience}</p>

            <p><strong>Description:</strong></p>
            <p>{editedJob.description}</p>

            <button
              className="primary-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Job
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default JobDetails;