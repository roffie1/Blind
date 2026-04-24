import React, { useState, useRef } from "react";
import "../../styles/employee.css";
import { startVoiceFlow } from "../../hooks/useVoiceInput";

function Profile({ setPage }) {
  const [form, setForm] = useState(() => {
    // ✅ Load saved profile from localStorage on mount if it exists
    const saved = localStorage.getItem("applicantData");
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          email: "",
          phone: "",
          gender: "",
          disability: "",
          location: "",
          skills: "",
        };
  });

  const [saved, setSaved] = useState(() => {
    // ✅ If profile already exists, start in "saved" mode
    return !!localStorage.getItem("applicantData");
  });

  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const genderRef = useRef();
  const disabilityRef = useRef();
  const locationRef = useRef();
  const skillsRef = useRef();

  const handleChange = (e) => {
    setSaved(false); // Mark as unsaved when user edits
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = (finalForm) => {
    localStorage.setItem("applicantData", JSON.stringify(finalForm));
    setSaved(true);
    console.log("✅ Profile saved:", finalForm);
  };

  const askToProceed = (finalForm) => {
    const allFilled = Object.values(finalForm).every((v) => v && v.trim() !== "");
    if (!allFilled) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const speak = (text, onEndCallback) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (onEndCallback) utterance.onend = onEndCallback;
      window.speechSynthesis.speak(utterance);
    };

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    // ✅ Save first
    saveProfile(finalForm);

    speak(
      "Your profile has been saved. You can now edit your information or say yes to find jobs.",
      () => {
        try {
          recognition.start();
        } catch (e) {
          console.log("Recognition start error:", e);
        }
      }
    );

    recognition.onresult = (event) => {
      const answer = event.results[0][0].transcript.toLowerCase().trim();
      console.log("🎤 Heard:", answer);

      if (answer.includes("yes") || answer.includes("find jobs")) {
        speak("Redirecting to job search.", () => {
          setPage("jobs");
        });
      } else {
        speak("Okay. You can edit your profile anytime. Press Save when done.");
      }
    };

    recognition.onerror = () => {
      speak("Profile saved. Use the buttons below to edit or find jobs.");
    };
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 tabIndex="0">Build Your Profile</h2>

        {/* ✅ Saved banner */}
        {saved && (
          <div className="saved-banner">
            ✅ Profile saved! You can edit your information below.
          </div>
        )}

        {/* NAME */}
        <label>Full Name</label>
        <input
          ref={nameRef}
          name="name"
          value={form.name}
          onChange={handleChange}
          tabIndex="0"
          onFocus={() =>
            startVoiceFlow("What is your full name?", (value) => {
              setForm((prev) => ({ ...prev, name: value }));
              setSaved(false);
              setTimeout(() => emailRef.current?.focus(), 500);
            })
          }
        />

        {/* EMAIL */}
        <label>Email</label>
        <input
          ref={emailRef}
          name="email"
          value={form.email}
          onChange={handleChange}
          tabIndex="0"
          onFocus={() =>
            startVoiceFlow("What is your email?", (value) => {
              setForm((prev) => ({ ...prev, email: value }));
              setSaved(false);
              setTimeout(() => phoneRef.current?.focus(), 500);
            })
          }
        />

        {/* PHONE */}
        <label>Phone</label>
        <input
          ref={phoneRef}
          name="phone"
          value={form.phone}
          onChange={handleChange}
          tabIndex="0"
          onFocus={() =>
            startVoiceFlow("What is your phone number?", (value) => {
              setForm((prev) => ({ ...prev, phone: value }));
              setSaved(false);
              setTimeout(() => genderRef.current?.focus(), 500);
            })
          }
        />

        {/* GENDER */}
        <label>Gender</label>
        <input
          ref={genderRef}
          name="gender"
          value={form.gender}
          onChange={handleChange}
          tabIndex="0"
          onFocus={() =>
            startVoiceFlow("What is your gender? Male or Female.", (value) => {
              setForm((prev) => ({ ...prev, gender: value }));
              setSaved(false);
              setTimeout(() => disabilityRef.current?.focus(), 500);
            })
          }
        />

        {/* DISABILITY */}
        <label>Disability Type</label>
        <input
          ref={disabilityRef}
          name="disability"
          value={form.disability}
          onChange={handleChange}
          tabIndex="0"
          onFocus={() =>
            startVoiceFlow(
              "What is your disability type? Totally blind, legally blind, or partially blind.",
              (value) => {
                setForm((prev) => ({ ...prev, disability: value }));
                setSaved(false);
                setTimeout(() => locationRef.current?.focus(), 500);
              }
            )
          }
        />

        {/* LOCATION */}
        <label>Location</label>
        <input
          ref={locationRef}
          name="location"
          value={form.location}
          onChange={handleChange}
          tabIndex="0"
          onFocus={() =>
            startVoiceFlow("What is your location?", (value) => {
              setForm((prev) => ({ ...prev, location: value }));
              setSaved(false);
              setTimeout(() => skillsRef.current?.focus(), 500);
            })
          }
        />

        {/* SKILLS */}
        <label>Skills</label>
        <input
          ref={skillsRef}
          name="skills"
          value={form.skills}
          onChange={handleChange}
          tabIndex="0"
          onFocus={() =>
            startVoiceFlow("What are your skills?", (value) => {
              setForm((prev) => {
                const updatedForm = { ...prev, skills: value };
                setTimeout(() => askToProceed(updatedForm), 300);
                return updatedForm;
              });
            })
          }
        />

        {/* ✅ TWO BUTTONS: Save Profile + Find Jobs */}
        <div className="btn-group">
          <button
            className="secondary-btn"
            onClick={() => {
              saveProfile(form);
              const speak = (text) => {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(u);
              };
              speak("Your profile has been saved. You can continue editing.");
            }}
          >
            💾 Save Profile
          </button>

          <button
            className="primary-btn"
            onClick={() => {
              saveProfile(form);
              setPage("jobs");
            }}
          >
            Find Jobs
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;