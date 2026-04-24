import React from "react";

function JobCard({ job }) {
  return (
    <div
      className="job-card"
      data-speak={`${job.title}, ${job.location}, Skills: ${job.skills.join(", ")}. Click to view details.`}
    >
      <h3>{job.title}</h3>
      <p>📍 {job.location}</p>
      <p>{job.skills.join(", ")}</p>
      <button data-speak={`Apply for ${job.title}`}>Apply</button>
    </div>
  );
}

export default JobCard;