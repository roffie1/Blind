const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 📝 In-memory database
let jobs = [
  { id: 101, company: "TechCorp", title: "Data Entry Clerk", type: "Remote", experience: "Entry Level", skills: "Typing", salary: "15000", description: "Data entry tasks.", createdAt: new Date() },
  { id: 102, company: "AssistHub", title: "Virtual Assistant", type: "Remote", experience: "Intermediate", skills: "Communication", salary: "20000", description: "Admin tasks.", createdAt: new Date() }
];

let applicants = [
  { id: 1, name: "Juan Applicant", email: "juan@example.com", phone: "123456789", gender: "Male", location: "Manila, Philippines", disability: "totally blind", skills: "typing, communication", appliedJobs: ["Data Entry Clerk"] },
  { id: 2, name: "Maria Santos", email: "maria@example.com", phone: "987654321", gender: "Female", location: "Cebu City, Philippines", disability: "partially blind", skills: "writing, management, encoding", appliedJobs: ["Virtual Assistant", "Data Entry Clerk"] }
];

// --- APPLICANT ENDPOINTS ---

// Get all applicants
app.get("/api/applicants", (req, res) => res.json(applicants));

// Accept or Reject an applicant and save the message
app.put("/api/applicants/:id/status", (req, res) => {
  const applicantId = parseInt(req.params.id);
  const { status, message } = req.body;

  const index = applicants.findIndex(a => a.id === applicantId);
  
  if (index !== -1) {
    // Update the applicant with their new status and the employer's message
    applicants[index] = { ...applicants[index], status: status, employerMessage: message };
    res.json(applicants[index]);
  } else {
    res.status(404).json({ error: "Applicant not found" });
  }
});

// Remove/Delete an applicant
app.delete("/api/applicants/:id", (req, res) => {
  const applicantId = parseInt(req.params.id);
  
  // Filter out the applicant that needs to be deleted
  applicants = applicants.filter(a => a.id !== applicantId);
  res.json({ success: true });
});

// --- JOB ENDPOINTS ---
// Get all jobs
app.get("/api/jobs", (req, res) => res.json(jobs));

// Create a new job
app.post("/api/jobs", (req, res) => {
  const newJob = { id: Date.now(), ...req.body, createdAt: new Date() };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

// Edit an existing job (PUT)
app.put("/api/jobs/:id", (req, res) => {
  const jobId = parseInt(req.params.id);
  const index = jobs.findIndex(j => j.id === jobId);
  
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...req.body }; // Update the job
    res.json(jobs[index]);
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});

// Delete a job (DELETE)
app.delete("/api/jobs/:id", (req, res) => {
  const jobId = parseInt(req.params.id);
  jobs = jobs.filter(j => j.id !== jobId); // Remove it from the array
  res.json({ success: true });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});