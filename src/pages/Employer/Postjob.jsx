import React, { useState, useEffect } from "react";
import "../../styles/employer.css";

function PostJob({ setPage, selectedJob }) {
  const [job, setJob] = useState({
    company: "",
    title: "",
    skills: "",
    location: "",
    salary: "",
    type: "Remote",
    experience: "Entry Level",
    description: ""
  });

  // ✅ Load selected job when editing
  useEffect(() => {
    if (selectedJob) {
      setJob(selectedJob);
    }
  }, [selectedJob]);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  // ✅ Send data to backend instead of local storage
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedJob && selectedJob.id) {
        // 🔥 EDIT MODE: Send PUT request
        await fetch(`http://localhost:5000/api/jobs/${selectedJob.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(job),
        });
      } else {
        // 🔥 CREATE MODE: Send POST request
        await fetch("http://localhost:5000/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(job),
        });
      }

      setPage("dashboard"); // Go back to dashboard on success

    } catch (err) {
      console.error("Failed to save job:", err);
      alert("Error saving job. Is the backend running?");
    }
  };

  return (
    <div className="postjob-container">
      <h2>{selectedJob ? "Edit Job" : "Post a Job"}</h2>

      <form className="postjob-form" onSubmit={handleSubmit}>

        <label>Company Name</label>
        <input name="company" value={job.company} onChange={handleChange} required />

        <label>Job Title</label>
        <input name="title" value={job.title} onChange={handleChange} required />

        <label>Skills Required</label>
        <input name="skills" value={job.skills} onChange={handleChange} required />

        <label>Location</label>
        <input name="location" value={job.location} onChange={handleChange} />

        <label>Salary (PHP)</label>
        <div className="salary-input">
          <span style={{
            padding: "12px 15px", background: "#eee", border: "1px solid #ccc",
            borderRadius: "6px", fontSize: "16px", fontWeight: "bold", color: "#555"
          }}>
            ₱
          </span>
          <input
            type="text"
            name="salary"
            value={job.salary}
            onChange={handleChange}
            placeholder="Enter amount (e.g., 20,000)"
          />
        </div>

        <label>Job Type</label>
        <select name="type" value={job.type} onChange={handleChange}>
          <option>Remote</option>
          <option>On-site</option>
        </select>

        <label>Experience Level</label>
        <select name="experience" value={job.experience} onChange={handleChange}>
          <option>Entry Level</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <label>Job Description</label>
        <textarea name="description" value={job.description} onChange={handleChange} />

        <button className="primary-btn">
          {selectedJob ? "Save Changes" : "Post Job"}
        </button>

      </form>
    </div>
  );
}

export default PostJob;