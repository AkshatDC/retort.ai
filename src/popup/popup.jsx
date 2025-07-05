import React, { useState, useEffect } from "react";
import "./styles.css";
import { getAIReply } from "../api/openrouter";

export default function Popup() {
  const [reply, setReply] = useState("");
  const [context, setContext] = useState("");
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("message");
  const [tone, setTone] = useState("Polite");
  const [contextSource, setContextSource] = useState("selection"); // 'selection' or 'fullpage'
  const [toast, setToast] = useState("");
  const [contextPreloaded, setContextPreloaded] = useState(false);

  useEffect(() => {
    // Load any saved context from right-click action
    chrome.storage.local.get(["retortContext"], (result) => {
      if (result.retortContext) {
        setContext(result.retortContext);
        setContextPreloaded(true);
        chrome.storage.local.remove(["retortContext"]);
      }
    });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const sendToAI = async (extracted) => {
    const input =
      mode === "message"
        ? `Rewrite the message "${userInput}" in a ${tone.toLowerCase()} tone.`
        : userInput;

    const prompt = `Context:\n${extracted}\n\nUser:\n${input}`;

    try {
      const result = await getAIReply(prompt);
      setReply(result || "No reply received.");
    } catch {
      setReply("Failed to fetch reply.");
    }
  };

  const generateReply = async () => {
    setLoading(true);

    if (contextPreloaded && contextSource === "selection" && context.trim() !== "") {
      await sendToAI(context);
      setLoading(false);
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "extractText", source: contextSource },
        async (response) => {
          const extracted = response?.text || "";

          if (contextSource === "selection" && (!extracted || extracted.startsWith("No text selected"))) {
            showToast("Please highlight text on the page before generating.");
            setLoading(false);
            return;
          }

          setContext(extracted);
          await sendToAI(extracted);
          setLoading(false);
        }
      );
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reply).then(() => {
      showToast("Reply copied to clipboard.");
    });
  };

  return (
    <div className="container">
      <h1 className="header-with-image">
        <img src="/icon.png" alt="Icon" className="header-icon" />
        retort.ai
      </h1>

      {/* Mode toggle */}
      <div className="toggle-section">
        <span className="switch-label">
          {mode === "message" ? "Message Mode" : "Prompt Mode"}
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={mode === "prompt"}
            onChange={() => setMode(mode === "message" ? "prompt" : "message")}
          />
          <span className="slider" />
        </label>
      </div>

      {/* Tone dropdown (only in Message Mode) */}
      {mode === "message" && (
        <div className="toggle-section" style={{ marginTop: 4 }}>
          <span className="switch-label">Tone:</span>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="tone-select"
          >
            <option value="Polite">Polite</option>
            <option value="Friendly">Friendly</option>
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
            <option value="Witty">Witty</option>
            <option value="Formal">Formal</option>
          </select>
        </div>
      )}

      {/* Context source dropdown */}
      <div className="toggle-section">
        <span className="switch-label">Context Source:</span>
        <select
          value={contextSource}
          onChange={(e) => setContextSource(e.target.value)}
          className="tone-select"
        >
          <option value="selection">Use Highlighted Text</option>
          <option value="fullpage">Use Full Page Content</option>
        </select>
      </div>

      {/* Input textarea */}
      <textarea
        className="box"
        placeholder={mode === "message" ? "Type your message..." : "Write a prompt..."}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />

      {/* Extracted context box */}
      <div className="box">{context || "Context will appear here..."}</div>

      {/* AI Reply with Copy Button */}
      <div className="box reply-box">
        <div style={{ flex: 1 }}>{reply || "AI reply will appear here..."}</div>
        {reply && (
          <button
            onClick={copyToClipboard}
            style={{
              fontSize: "0.7rem",
              padding: "0.2rem 0.5rem",
              marginTop: 0,
              marginLeft: 4,
              whiteSpace: "nowrap",
              height: "fit-content"
            }}
          >
            Copy
          </button>
        )}
      </div>

      {/* Generate button */}
      <button onClick={generateReply} disabled={loading}>
        {loading ? "Thinking..." : "Generate Reply"}
      </button>

      {/* Toast Notification */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
