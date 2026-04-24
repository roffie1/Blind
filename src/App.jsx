import React, { useState, useEffect } from "react";
import Login from "./pages/Auth/Login";
import Navbar from "./components/Navbar";
import ScreenReaderToggle from "./components/ScreenReaderToggle";

// EMPLOYEE
import Profile from "./pages/Employee/Profile";
import Jobs from "./pages/Employee/Jobs";

// EMPLOYER
import EmployerDashboard from "./pages/Employer/Dashboard";
import PostJob from "./pages/Employer/Postjob";
import Applicants from "./pages/Employer/Applicants";
import JobDetails from "./pages/Employer/JobDetails";

function App() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("login");
  const [isBlind, setIsBlind] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // 🔥 DETECT USER TYPE
  useEffect(() => {
    const impairment = localStorage.getItem("userImpairment");

    if (impairment === "blind") {
      setIsBlind(true);
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(
          "Screen reader enabled. Use arrow keys to navigate."
        )
      );
    } else {
      setIsBlind(false);
    }
  }, [role]);

  // 🔥 ARROW KEY NAVIGATION
  useEffect(() => {
    if (!isBlind) return;

    const getFocusable = () =>
      Array.from(
        document.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

    const handleFocus = (e) => {
      const el = e.target;
      const text =
        el.getAttribute("data-speak") ||
        el.innerText ||
        el.value ||
        el.placeholder;

      if (text) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
      }
    };

    const handleKey = (e) => {
      const elements = getFocusable();
      const current = document.activeElement;
      const currentRect = current.getBoundingClientRect();

      const cx = (el) =>
        el.getBoundingClientRect().left +
        el.getBoundingClientRect().width / 2;
      const cy = (el) =>
        el.getBoundingClientRect().top +
        el.getBoundingClientRect().height / 2;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const below = elements.filter(
          (el) =>
            el !== current &&
            el.getBoundingClientRect().top > currentRect.bottom - 5
        );
        if (below.length === 0) return;

        below.sort((a, b) => {
          const dyA = cy(a) - cy(current);
          const dyB = cy(b) - cy(current);
          if (Math.abs(dyA - dyB) > 10) return dyA - dyB;
          return (
            Math.abs(cx(a) - cx(current)) -
            Math.abs(cx(b) - cx(current))
          );
        });

        below[0].focus();
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const above = elements.filter(
          (el) =>
            el !== current &&
            el.getBoundingClientRect().bottom <
              currentRect.top + 5
        );
        if (above.length === 0) return;

        above.sort((a, b) => {
          const dyA = cy(current) - cy(a);
          const dyB = cy(current) - cy(b);
          if (Math.abs(dyA - dyB) > 10) return dyA - dyB;
          return (
            Math.abs(cx(a) - cx(current)) -
            Math.abs(cx(b) - cx(current))
          );
        });

        above[0].focus();
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        const right = elements.filter(
          (el) =>
            el !== current &&
            el.getBoundingClientRect().left >
              currentRect.right - 5
        );
        if (right.length === 0) return;

        right.sort((a, b) => {
          const dxA = cx(a) - cx(current);
          const dxB = cx(b) - cx(current);
          if (Math.abs(dxA - dxB) > 10) return dxA - dxB;
          return (
            Math.abs(cy(a) - cy(current)) -
            Math.abs(cy(b) - cy(current))
          );
        });

        right[0].focus();
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const left = elements.filter(
          (el) =>
            el !== current &&
            el.getBoundingClientRect().right <
              currentRect.left + 5
        );
        if (left.length === 0) return;

        left.sort((a, b) => {
          const dxA = cx(current) - cx(a);
          const dxB = cx(current) - cx(b);
          if (Math.abs(dxA - dxB) > 10) return dxA - dxB;
          return (
            Math.abs(cy(a) - cy(current)) -
            Math.abs(cy(b) - cy(current))
          );
        });

        left[0].focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    document.addEventListener("focus", handleFocus, true);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("focus", handleFocus, true);
    };
  }, [isBlind]);

  // LOGIN SCREEN
  if (!role) {
    return <Login setRole={setRole} setPage={setPage} />;
  }

  return (
    <>
      <Navbar 
        setPage={setPage}
        role={role}
        page={page}
        setSelectedJob ={setSelectedJob}
      />

      {!isBlind && <ScreenReaderToggle />}

      {/* ================= EMPLOYEE ================= */}
      {role === "employee" && page === "profile" && (
        <Profile setPage={setPage} />
      )}

      {role === "employee" && page === "jobs" && (
        <Jobs setPage={setPage} />
      )}

      {/* ================= EMPLOYER ================= */}
      {role === "employer" && page === "dashboard" && (
        <EmployerDashboard
          setPage={setPage}
          setSelectedJob={setSelectedJob}
        />
      )}

      {role === "employer" && page === "post" && (
        <PostJob
          setPage={setPage}
          selectedJob={selectedJob}
        />
      )}

      {role === "employer" && page === "applicants" && (
        <Applicants setPage={setPage} />
      )}

      {role === "employer" && page === "jobdetails" && (
        <JobDetails
          job={selectedJob}
          setPage={setPage}
        />
      )}
    </>
  );
}

export default App;