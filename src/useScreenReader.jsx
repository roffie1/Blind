import { useEffect } from "react";

export function useScreenReader(enabled, setPage) {
  useEffect(() => {
    if (!enabled) return;

    const speak = (text) => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    };

    let elements = [];
    let currentIndex = 0;

    const updateElements = () => {
      elements = Array.from(
        document.querySelectorAll("[data-speak]")
      );
    };

    const focusElement = (index) => {
      if (!elements.length) return;

      currentIndex = (index + elements.length) % elements.length;

      const el = elements[currentIndex];
      el.focus();

      const text = el.getAttribute("data-speak");
      if (text) speak(text);
    };

    const handleKey = (e) => {
      updateElements();

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          focusElement(currentIndex + 1);
          break;

        case "ArrowUp":
          e.preventDefault();
          focusElement(currentIndex - 1);
          break;

        case "ArrowRight":
          e.preventDefault();
          elements[currentIndex]?.click(); // OPEN / SELECT
          break;

        case "ArrowLeft":
          e.preventDefault();
          if (setPage) {
            speak("Going back");
            setPage("jobs"); // 👈 change if needed
          }
          break;

        case "Enter":
          elements[currentIndex]?.click();
          break;

        default:
          break;
      }
    };

    updateElements();

    // 🔊 read first element
    setTimeout(() => {
      focusElement(0);
    }, 500);

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [enabled, setPage]);
}