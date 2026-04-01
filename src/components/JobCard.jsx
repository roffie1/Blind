import React from "react";

function JobCard({ job }) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>📍 {job.location}</p>
      <p>{job.skills.join(", ")}</p>
      <button>Apply</button>
    </div>
  );
}

export default JobCard;