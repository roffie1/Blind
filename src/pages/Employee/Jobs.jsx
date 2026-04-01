import React, { useState } from "react";
import "../../styles/employee.css";

function Jobs({ setPage }) {
  const [search, setSearch] = useState("");
  const [impairment, setImpairment] = useState("blind");
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      title: "Data Entry Clerk",
      skills: ["typing"],
      type: "Remote",
      experience: "Entry Level",
      description: "Encode data, maintain records, and ensure accuracy.",
      category: "blind"
    },
    {
      title: "Virtual Assistant",
      skills: ["communication", "typing"],
      type: "Remote",
      experience: "Intermediate",
      description: "Assist clients with emails, scheduling, and admin tasks.",
      category: "blind"
    }
  ];

  const filteredJobs = jobs.filter((job) =>
    job.skills.some((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    ) && job.category === impairment
  );

  // 🔥 APPLY FUNCTION
  const handleApply = (job) => {
    const applicant =
      JSON.parse(localStorage.getItem("applicantData")) || {
        name: "Unknown",
        location: "Unknown",
        impairment: "Unknown",
      };

    const existing =
      JSON.parse(localStorage.getItem("applications")) || [];

    const updated = [
      ...existing,
      {
        ...applicant,
        jobTitle: job.title,
        time: new Date(),
      },
    ];

    localStorage.setItem("applications", JSON.stringify(updated));

    window.addNotification({
      message: `New applicant for ${job.title}`,
      role: "employer",
      page: "applicants",
    });
  };

  return (
    <div className="jobs-container">

      <div className="jobs-header">
        <h2>Find Jobs</h2>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={impairment}
          onChange={(e) => setImpairment(e.target.value)}
        >
          <option value="blind">Blind</option>
          <option value="low-vision">Low Vision</option>
          <option value="color-blind">Color Blind</option>
        </select>
      </div>

      {/* 🔥 JOB LIST */}
      {!selectedJob && (
        <div className="job-list">
          {filteredJobs.map((job, i) => (
            <div
              key={i}
              className="job-card clickable"
              onClick={() => setSelectedJob(job)}
            >
              <h3>{job.title}</h3>
              <p>{job.skills.join(", ")}</p>
              <span>{job.type} • {job.experience}</span>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 JOB DETAILS VIEW */}
      {selectedJob && (
        <div className="job-details">

          <button
            className="secondary-btn"
            onClick={() => setSelectedJob(null)}
          >
            ← Back
          </button>

          <h2>{selectedJob.title}</h2>

          <p><strong>Type:</strong> {selectedJob.type}</p>
          <p><strong>Experience:</strong> {selectedJob.experience}</p>
          <p><strong>Skills:</strong> {selectedJob.skills.join(", ")}</p>

          <p style={{ marginTop: "15px" }}>
            <strong>Description:</strong><br />
            {selectedJob.description}
          </p>

          <button
            className="apply-btn"
            style={{ marginTop: "20px" }}
            onClick={() => handleApply(selectedJob)}
          >
            Apply
          </button>

        </div>
      )}

    </div>
  );
}

export default Jobs;