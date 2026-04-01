import React, { useState } from "react";

import Login from "./pages/Auth/Login";
import Navbar from "./components/Navbar";

import Profile from "./pages/Employee/Profile";
import Jobs from "./pages/Employee/Jobs";

import EmployerDashboard from "./pages/Employer/Dashboard";
import PostJob from "./pages/Employer/Postjob";
import Applicants from "./pages/Employer/Applicants";
import JobDetails from "./pages/Employer/JobDetails";

function App() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("login");
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // 🔥 GLOBAL NOTIFICATIONS
  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem("notifications")) || [];
  });

  const addNotification = (notif) => {
    const updated = [...notifications, notif];
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  window.addNotification = addNotification;
  window.notifications = notifications;

  if (!role) {
    return <Login setRole={setRole} setPage={setPage} />;
  }

  return (
    <>
      <Navbar setPage={setPage} role={role} />

      {/* EMPLOYEE */}
      {role === "employee" && page === "profile" && (
        <Profile setPage={setPage} />
      )}

      {role === "employee" && page === "jobs" && (
        <Jobs setPage={setPage} />
      )}

      {/* EMPLOYER */}
      {role === "employer" && page === "dashboard" && (
        <EmployerDashboard
          setPage={setPage}
          setSelectedJob={setSelectedJob}
        />
      )}

      {role === "employer" && page === "post" && (
        <PostJob setPage={setPage} />
      )}

      {role === "employer" && page === "applicants" && (
        <Applicants
          setPage={setPage}
          selectedApplicant={selectedApplicant}
          setSelectedApplicant={setSelectedApplicant}
        />
      )}

      {role === "employer" && page === "jobdetails" && (
        <JobDetails job={selectedJob} setPage={setPage} />
      )}
    </>
  );
}

export default App;