// ✅ FIX 1: Track the active microphone globally to prevent overlapping crashes
let globalActiveRecognition = null;

export const startVoiceFlow = (label, onFinal) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported");
    return;
  }

  // Stop any currently running mic before starting a new one
  if (globalActiveRecognition) {
    try {
      globalActiveRecognition.abort();
    } catch (e) {}
  }

  let currentUtterance = null;
  
  // ✅ FIX 2: Add a retry limit so it doesn't loop forever
  let retryCount = 0;
  const MAX_RETRIES = 2; 

  const speak = (text, onEndCallback) => {
    window.speechSynthesis.cancel();
    currentUtterance = new SpeechSynthesisUtterance(text);

    if (onEndCallback) {
      currentUtterance.onend = onEndCallback;
      currentUtterance.onerror = (e) => {
        // ✅ FIX 3: Do NOT fire the callback if we intentionally canceled it!
        if (e.error === 'canceled' || e.error === 'interrupted') return;
        onEndCallback();
      };
    }

    window.speechSynthesis.speak(currentUtterance);
  };

  let storedInput = "";

  const listen = (callback) => {
    const recognition = new SpeechRecognition();
    globalActiveRecognition = recognition;

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    let hasHandledResult = false;

    console.log("🎤 Mic turned ON for:", label);

    recognition.onresult = (event) => {
      hasHandledResult = true;
      const text = event.results[0][0].transcript.toLowerCase().trim();
      console.log("🎤 Heard:", text);
      callback(text);
    };

    recognition.onerror = (e) => {
      console.log("❌ Mic Error:", e.error);
      if (!hasHandledResult) {
        hasHandledResult = true;
        callback("");
      }
    };

    recognition.onend = () => {
      if (!hasHandledResult) {
        hasHandledResult = true;
        console.log("🎤 Mic turned OFF due to silence.");
        callback("");
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.log("Failed to start mic", e);
    }
  };

  const cleanInput = (text, fieldLabel) => {
    if (fieldLabel.includes("email")) {
      return text
        .replace(/ at /g, "@")
        .replace(/ dot /g, ".")
        .replace(/\s/g, "");
    }
    if (fieldLabel.includes("phone")) {
      return text.replace(/\D/g, "");
    }
    return text;
  };

  const askConfirmation = () => {
    speak(`You said ${storedInput}. Say confirm or repeat.`, () => {
      listen((command) => {
        if (!command) {
          retryCount++;
          if (retryCount > MAX_RETRIES) {
              speak("I am having trouble hearing you. Please try again later.");
              return;
          }
          speak("I did not hear you. Please say confirm or repeat.", askConfirmation);
          return;
        }

        if (command.includes("confirm") || command.includes("yes") || command.includes("correct")) {
          const cleaned = cleanInput(storedInput, label);
          console.log("✅ FINAL VALUE:", cleaned);
          onFinal(cleaned);
        } else if (command.includes("repeat") || command.includes("no")) {
          retryCount = 0; // Reset retries on a valid command
          speak("Repeating.", start);
        } else {
          retryCount++;
          if (retryCount > MAX_RETRIES) {
              speak("Canceling input. Please try again later.");
              return;
          }
          speak("I did not understand. Say confirm or repeat.", askConfirmation);
        }
      });
    });
  };

  const start = () => {
    speak(label, () => {
      listen((input) => {
        if (!input) {
          retryCount++;
          if (retryCount > MAX_RETRIES) {
              speak("I did not hear anything. Please select the field to try again.");
              return;
          }
          speak("I did not hear anything. Try again.", start);
          return;
        }

        retryCount = 0; // Reset retries on a successful hear
        storedInput = input;
        askConfirmation();
      });
    });
  };

  start();
};