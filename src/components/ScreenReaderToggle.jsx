import { useState } from "react";

export default function ScreenReaderToggle({ enabled, setEnabled }) {
  return (
    <button
      onClick={() => setEnabled((prev) => !prev)}
      aria-label={enabled ? "Disable Screen Reader" : "Enable Screen Reader"}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        padding: "12px 18px",
        backgroundColor: enabled ? "#4CAF50" : "#333",
        color: "#fff",
        border: "none",
        borderRadius: "50px",
        cursor: "pointer",
      }}
    >
      {enabled ? "🔊 ON" : "🔇 OFF"}
    </button>
  );
}