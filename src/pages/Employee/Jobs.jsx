import React, { useState, useEffect } from "react";
import "../../styles/employee.css";
import { startVoiceFlow } from "../../hooks/useVoiceInput";

function Jobs({ setPage }) {
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  // NEW: States to hold the user's saved profile data
  const [userSkills, setUserSkills] = useState([]);
  const [userDisability, setUserDisability] = useState("blind");

  const jobs = [
    {
      title: "Data Entry Clerk",
      skills: ["typing"],
      type: "Remote",
      experience: "Entry Level",
      description: "Encode data and maintain records.",
      category: "blind"
    },
    {
      title: "Virtual Assistant",
      skills: ["communication", "typing"],
      type: "Remote",
      experience: "Intermediate",
      description: "Assist with emails and admin tasks.",
      category: "blind"
    }
  ];

  // 1. Fetch user profile data on load
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("applicantData"));
    
    if (savedData) {
      if (savedData.disability) {
        setUserDisability(savedData.disability.toLowerCase());
      }
      
      if (savedData.skills) {
        // Break the dictated skills string down into a clean array
        const parsedSkills = savedData.skills
          .toLowerCase()
          .split(/[\s,]+/)
          .filter(Boolean);
          
        setUserSkills(parsedSkills);
      }
    }
  }, []);

  // 2. Automatically filter the jobs
  const filteredJobs = jobs.filter((job) => {
    // Match disability category
    const jobCategory = job.category.toLowerCase();
    const matchesDisability = jobCategory.includes(userDisability) || userDisability.includes(jobCategory);

    // Match skills (if user has no skills saved, show all to prevent an empty screen)
    const jobSkillsNormalized = job.skills.map((s) => s.toLowerCase());
    const matchesSkills = userSkills.length === 0 || userSkills.some((userSkill) =>
      jobSkillsNormalized.some((jobSkill) => jobSkill.includes(userSkill) || userSkill.includes(jobSkill))
    );

    // Manual search override
    const matchesSearch = search === "" || 
      job.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) || 
      job.title.toLowerCase().includes(search.toLowerCase());

    return matchesDisability && matchesSkills && matchesSearch;
  });

  // 3. Announce the number of matched jobs to the user
  useEffect(() => {
    const timeout = setTimeout(() => {
      const count = filteredJobs.length;
      let textToSpeak = "";
      
      if (count === 0) {
        textToSpeak = "No jobs found matching your skills. Try searching manually.";
      } else if (count === 1) {
        textToSpeak = "Found 1 job matching your profile.";
      } else {
        textToSpeak = `Found ${count} jobs matching your profile.`;
      }
      
      // Cancel any ongoing speech so this plays cleanly
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(textToSpeak));
    }, 1500); 

    return () => clearTimeout(timeout);
  }, [filteredJobs.length]);

  return (
    <div className="jobs-container">

      {/* TITLE */}
      <h2
        tabIndex="0"
        data-speak="Find jobs page"
      >
        Find Jobs
      </h2>

      {/* SEARCH */}
      <div className="search-box">

        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          tabIndex="0"
          data-speak="Search jobs. Press microphone or type"
        />

        <button
          onClick={() => startVoiceFlow("What job are you looking for?", setSearch)}
          tabIndex="0"
          data-speak="Start voice search"
        >
          🎤
        </button>

      </div>

      {/* JOB LIST */}
      {!selectedJob && (
        <div className="job-list">
          {filteredJobs.length === 0 ? (
             <p className="no-jobs" tabIndex="0" data-speak="No jobs found.">No jobs found matching your criteria.</p>
          ) : (
            filteredJobs.map((job, i) => (
              <div
                key={i}
                className="job-card clickable"
                tabIndex="0"
                role="button"
                onClick={() => setSelectedJob(job)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedJob(job)}
                data-speak={`Job title ${job.title}. Skills ${job.skills.join(
                  ", "
                )}. ${job.type}. ${job.experience}. Press enter to view details`}
              >
                <h3>{job.title}</h3>
                <p>{job.skills.join(", ")}</p>
                <span className="job-type">{job.type}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* DETAILS */}
      {selectedJob && (
        <div className="job-details">

          <button
            onClick={() => setSelectedJob(null)}
            tabIndex="0"
            data-speak="Go back to job list"
          >
            ← Back
          </button>

          <h2 tabIndex="0" data-speak={`Job title ${selectedJob.title}`}>
            {selectedJob.title}
          </h2>

          <p tabIndex="0" data-speak={`Job type ${selectedJob.type}`}>
            <strong>Type:</strong> {selectedJob.type}
          </p>

          <p tabIndex="0" data-speak={`Experience ${selectedJob.experience}`}>
            <strong>Experience:</strong> {selectedJob.experience}
          </p>

          <p
            tabIndex="0"
            data-speak={`Skills ${selectedJob.skills.join(", ")}`}
          >
            <strong>Skills:</strong> {selectedJob.skills.join(", ")}
          </p>

          <p
            tabIndex="0"
            data-speak={`Description ${selectedJob.description}`}
          >
            <strong>Description:</strong> {selectedJob.description}
          </p>

          <button
            className="apply-btn"
            onClick={() => {
              const existing =
                JSON.parse(localStorage.getItem("applications")) || [];

              const updated = [
                ...existing,
                { jobTitle: selectedJob.title, time: new Date() }
              ];

              localStorage.setItem("applications", JSON.stringify(updated));

              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(
                new SpeechSynthesisUtterance(
                  `Successfully applied to ${selectedJob.title}`
                )
              );
            }}
            tabIndex="0"
            data-speak={`Apply for ${selectedJob.title}`}
          >
            Apply
          </button>

        </div>
      )}

    </div>
  );
}

export default Jobs;