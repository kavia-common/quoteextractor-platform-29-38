import React, { useEffect, useMemo, useRef, useState } from "react";
import { appendTranscriptSegment } from "../api/client";

/**
 * TranscriptEditor
 * A rich but lightweight inline transcript editor with:
 * - Full text editing with segment-aware styling
 * - Inline selection highlight + "Add as segment" helper
 * - Save action bubble and keyboard shortcuts (Cmd/Ctrl+S)
 * - CTA to Extract Quotes
 *
 * Props:
 * - transcript: { id, text, segments?, language?, asset_id? }
 * - onChange: function(newText: string) -> void
 * - onSave: function() -> Promise<void> | void
 * - onExtractQuotes: function() -> void
 * - saving: boolean - indicates save is in progress
 * - error: string - optional error message to display
 * - onAppendSegment: async function({ start, end, text, speaker? }) -> void (optional)
 */
export default function TranscriptEditor({
  transcript,
  onChange,
  onSave,
  onExtractQuotes,
  saving = false,
  error = "",
  onAppendSegment,
}) {
  const [localText, setLocalText] = useState(transcript?.text || "");
  const [dirty, setDirty] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0, text: "" });
  const [note, setNote] = useState("");
  const textAreaRef = useRef(null);

  useEffect(() => {
    setLocalText(transcript?.text || "");
    setDirty(false);
  }, [transcript?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle selection changes on the textarea
  const updateSelection = () => {
    const el = textAreaRef.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const selText = (localText || "").slice(start, end);
    setSelection({ start, end, text: selText });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = async (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (onSave) {
          await onSave();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSave]);

  const segments = transcript?.segments || [];

  const onTextChange = (e) => {
    const val = e.target.value;
    setLocalText(val);
    setDirty(true);
    if (onChange) onChange(val);
  };

  const doAppendSegment = async () => {
    const txt = selection.text?.trim();
    if (!txt) {
      setNote("Select some text in the transcript to append as a segment.");
      return;
    }
    // For MVP, convert character index range to a pseudo time range (seconds), or leave null.
    // Here we store zero timing, focusing on text grouping.
    try {
      if (onAppendSegment) {
        await onAppendSegment({ start: 0, end: Math.max(1, Math.round(txt.length / 8)), text: txt });
      } else if (transcript?.id) {
        await appendTranscriptSegment(transcript.id, {
          start: 0,
          end: Math.max(1, Math.round(txt.length / 8)),
          text: txt,
        });
      }
      setNote("Segment appended.");
    } catch (e) {
      setNote(e?.payload?.detail || e?.message || "Failed to append segment.");
    }
  };

  const selectionBadge = useMemo(() => {
    if (!selection?.text) return null;
    const length = selection.text.length;
    return (
      <div style={selectionBar}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ opacity: 0.85 }}>Selected</span>
          <span style={chipSmall}>{length} chars</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={doAppendSegment} style={miniPrimaryBtn} title="Add selection as a new segment">
            ➕ Add as Segment
          </button>
          <button
            onClick={() => {
              const el = textAreaRef.current;
              if (!el) return;
              el.selectionStart = el.selectionEnd = el.selectionEnd; // collapse to end
              setSelection({ start: el.selectionStart, end: el.selectionEnd, text: "" });
            }}
            style={miniGhostBtn}
            title="Clear selection"
          >
            ✖ Clear
          </button>
        </div>
      </div>
    );
  }, [selection]);

  return (
    <div style={wrapStyle}>
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={eyebrowStyle}>Transcript</span>
          {transcript?.language && <span style={chipSmall}>{transcript.language}</span>}
          {dirty && <span style={{ ...chipSmall, background: "#FFB020", color: "#0b0b0b" }}>Unsaved</span>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onSave}
            disabled={saving || !dirty}
            style={{ ...primaryBtn, ...(saving || !dirty ? btnDisabled : {}) }}
            aria-busy={saving ? "true" : undefined}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button onClick={onExtractQuotes} style={ctaBtn} title="Extract quotes from this transcript">
            ⚡ Extract Quotes
          </button>
        </div>
      </header>

      {!!error && (
        <div role="alert" style={errorStyle} aria-live="polite">
          {error}
        </div>
      )}

      {selectionBadge}

      <div style={editorWrap}>
        <div style={leftCol}>
          <label htmlFor="transcript-editor" style={labelStyle}>
            Full Text
          </label>
          <textarea
            id="transcript-editor"
            ref={textAreaRef}
            value={localText}
            onChange={onTextChange}
            onSelect={updateSelection}
            onKeyUp={updateSelection}
            placeholder="Transcript text will appear here. Edit inline..."
            style={textAreaStyle}
          />
          {!!note && <div style={noteStyle}>{note}</div>}
          <div style={hintStyle}>Tip: Use Ctrl/Cmd+S to save quickly.</div>
        </div>

        <div style={rightCol}>
          <div style={segmentsHeader}>
            <div style={{ fontWeight: 800 }}>Segments</div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>{segments.length} items</div>
          </div>
          <div style={segmentsList}>
            {segments.length === 0 && (
              <div style={emptySeg}>
                No segments yet. Select part of the text and click “Add as Segment”.
              </div>
            )}
            {segments.map((s, idx) => (
              <div key={idx} style={segmentItem}>
                <div style={segmentTop}>
                  <span style={segmentBadge}>
                    {formatTime(s.start)} - {formatTime(s.end)}
                  </span>
                  {s.speaker && <span style={{ ...chipSmall, marginLeft: "auto" }}>{s.speaker}</span>}
                </div>
                <div style={segmentText}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(t) {
  if (typeof t !== "number" || Number.isNaN(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Styles
const wrapStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const editorWrap = {
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr",
  gap: 14,
};

const leftCol = {
  border: "1px solid var(--border-color)",
  background: "var(--bg-secondary)",
  borderRadius: 14,
  padding: 12,
};

const rightCol = {
  border: "1px solid var(--border-color)",
  background: "var(--bg-secondary)",
  borderRadius: 14,
  padding: 12,
  maxHeight: 540,
  overflow: "auto",
};

const labelStyle = {
  fontSize: 12,
  opacity: 0.8,
  display: "block",
  marginBottom: 8,
};

const textAreaStyle = {
  width: "100%",
  minHeight: 320,
  maxHeight: 520,
  padding: 12,
  borderRadius: 12,
  border: "1px solid var(--border-color)",
  resize: "vertical",
  background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.03))",
  color: "var(--text-primary)",
  lineHeight: 1.55,
  fontFamily: "inherit",
};

const segmentsHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 8,
};

const segmentsList = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const emptySeg = {
  opacity: 0.7,
  fontSize: 14,
  border: "1px dashed var(--border-color)",
  borderRadius: 12,
  padding: 10,
};

const segmentItem = {
  border: "1px solid var(--border-color)",
  borderRadius: 12,
  padding: 10,
  background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.04))",
};

const segmentTop = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 6,
};

const segmentBadge = {
  fontSize: 12,
  background: "rgba(97,218,251,0.25)",
  color: "#0b0b0b",
  padding: "4px 8px",
  borderRadius: 999,
  fontWeight: 700,
  letterSpacing: 0.3,
};

const segmentText = {
  whiteSpace: "pre-wrap",
  lineHeight: 1.5,
};

const eyebrowStyle = {
  display: "inline-block",
  fontSize: 12,
  letterSpacing: 1.2,
  textTransform: "uppercase",
  color: "var(--text-secondary)",
  padding: "5px 9px",
  border: "1px solid var(--border-color)",
  borderRadius: 999,
};

const chipSmall = {
  fontSize: 11,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid var(--border-color)",
};

const primaryBtn = {
  background: "linear-gradient(90deg, rgba(97,218,251,0.9), rgba(34,197,94,0.9))",
  color: "#0b0b0b",
  border: "none",
  borderRadius: 10,
  padding: "10px 16px",
  fontWeight: 800,
  letterSpacing: 0.3,
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
};

const ctaBtn = {
  background: "transparent",
  color: "var(--text-primary)",
  border: "1px solid rgba(97,218,251,0.6)",
  borderRadius: 10,
  padding: "10px 16px",
  fontWeight: 800,
  letterSpacing: 0.3,
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
};

const miniPrimaryBtn = {
  background: "linear-gradient(90deg, rgba(97,218,251,0.9), rgba(34,197,94,0.9))",
  color: "#0b0b0b",
  border: "none",
  borderRadius: 8,
  padding: "6px 10px",
  fontWeight: 800,
  letterSpacing: 0.2,
  cursor: "pointer",
};

const miniGhostBtn = {
  background: "transparent",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "6px 10px",
  fontWeight: 700,
  cursor: "pointer",
};

const btnDisabled = {
  opacity: 0.5,
  cursor: "not-allowed",
};

const selectionBar = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  padding: "8px 10px",
  border: "1px dashed var(--border-color)",
  borderRadius: 10,
  background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.04))",
};

const errorStyle = {
  padding: 12,
  border: "1px solid rgba(239,68,68,0.4)",
  background: "rgba(239,68,68,0.08)",
  color: "#EF4444",
  borderRadius: 10,
  fontWeight: 600,
};

const noteStyle = {
  fontSize: 12,
  marginTop: 6,
  opacity: 0.85,
};

const hintStyle = {
  fontSize: 12,
  opacity: 0.65,
  marginTop: 4,
};

// Responsive tweak
if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
@media (max-width: 900px) {
  .te-grid {
    grid-template-columns: 1fr !important;
  }
}
`;
  document.head.appendChild(styleTag);
}
