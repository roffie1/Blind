import React, { useState } from "react";
import "../../styles/employer.css";

function PostJob({ setPage }) {
  const [job, setJob] = useState({
    title: "",
    skills: "",
    location: "",
    type: "Remote",
    experience: "Entry Level",
    description: ""
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existing =
      JSON.parse(localStorage.getItem("jobs")) || [];

    const updated = [
      ...existing,
      {
        ...job,
        createdAt: new Date()
      }
    ];

    localStorage.setItem("jobs", JSON.stringify(updated));

    setPage("dashboard");
  };

  return (
    <div className="postjob-container">

      <h2>Post a Job</h2>

      <form className="postjob-form" onSubmit={handleSubmit}>

        <label>Job Title</label>
        <input
          name="title"
          onChange={handleChange}
          required
        />

        <label>Skills Required</label>
        <input
          name="skills"
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          name="location"
          onChange={handleChange}
        />

        <label>Job Type</label>
        <select name="type" onChange={handleChange}>
          <option>Remote</option>
          <option>On-site</option>
        </select>

        <label>Experience Level</label>
        <select name="experience" onChange={handleChange}>
          <option>Entry Level</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <label>Job Description</label>
        <textarea
          name="description"
          onChange={handleChange}
        />

        <button className="primary-btn">Post Job</button>

      </form>
    </div>
  );
}

export default PostJob;