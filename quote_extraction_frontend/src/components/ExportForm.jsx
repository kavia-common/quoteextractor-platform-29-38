import React, { useMemo, useState } from "react";

/**
 * ExportForm
 * A modern minimal form allowing:
 * - Format selection (plain_text, json, twitter, linkedin, instagram, srt, vtt)
 * - Optional title and author for applicable formats
 * - Quote selection (checkbox list)
 * - Submit to create export job
 *
 * Props:
 * - quotes: Quote[] - list of approved quotes
 * - disabled: boolean
 * - onSubmit: function({ format, title?, author?, quoteIds: string[] })
 */
export default function ExportForm({ quotes = [], disabled = false, onSubmit }) {
  const [format, setFormat] = useState("plain_text");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [selected, setSelected] = useState(() => new Set());

  const quoteArray = useMemo(() => (Array.isArray(quotes) ? quotes : []), [quotes]);

  const onToggleQuote = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const onSelectAll = () => {
    setSelected(new Set(quoteArray.map((q) => q.id)));
  };
  const onClearAll = () => {
    setSelected(new Set());
  };

  const onSubmitClick = (e) => {
    e.preventDefault();
    if (!onSubmit) return;
    const quoteIds = Array.from(selected);
    onSubmit({
      format,
      title: title.trim() || "",
      author: author.trim() || "",
      quoteIds,
    });
  };

  const isMetaApplicable = useMemo(() => {
    // title/author are meaningful for "plain_text" and social text formats
    return ["plain_text", "twitter", "linkedin", "instagram"].includes(format);
  }, [format]);

  return (
    <form onSubmit={onSubmitClick} style={wrap}>
      <div style={row}>
        <div style={group}>
          <label htmlFor="format" style={label}>Format</label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            style={select}
            disabled={disabled}
          >
            <option value="plain_text">Plain Text</option>
            <option value="json">JSON</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="srt">SRT (captions)</option>
            <option value="vtt">WebVTT (captions)</option>
          </select>
        </div>

        {isMetaApplicable && (
          <>
            <div style={{ ...group, flex: 1 }}>
              <label htmlFor="title" style={label}>Title (optional)</label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Highlights from the Interview"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={input}
                disabled={disabled}
              />
            </div>
            <div style={{ ...group, flex: 1 }}>
              <label htmlFor="author" style={label}>Author (optional)</label>
              <input
                id="author"
                type="text"
                placeholder="e.g., Jane Doe"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={input}
                disabled={disabled}
              />
            </div>
          </>
        )}
      </div>

      <div style={listHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, letterSpacing: 0.3 }}>Include Quotes</span>
          <span style={chipSmall}>{selected.size} selected</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            style={miniGhostBtn}
            onClick={onSelectAll}
            disabled={disabled || quoteArray.length === 0}
            title="Select all"
          >
            Select All
          </button>
          <button
            type="button"
            style={miniGhostBtn}
            onClick={onClearAll}
            disabled={disabled || selected.size === 0}
            title="Clear selection"
          >
            Clear
          </button>
        </div>
      </div>

      <div style={quoteList}>
        {quoteArray.length === 0 && (
          <div style={emptyBox}>No approved quotes available.</div>
        )}
        {quoteArray.map((q) => (
          <label key={q.id} style={quoteItem}>
            <input
              type="checkbox"
              checked={selected.has(q.id)}
              onChange={() => onToggleQuote(q.id)}
              disabled={disabled}
              aria-label={`Select quote ${q.id}`}
              style={{ marginRight: 8 }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={chipTime}>{formatTime(q.start)} - {formatTime(q.end)}</span>
                {typeof q.confidence === "number" && <span style={chipSmall}>Conf: {q.confidence.toFixed(2)}</span>}
                {q.tags?.length ? (
                  <span style={{ ...chipSmall, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>
                    {q.tags.slice(0, 3).map((t) => `#${t}`).join(" ")}
                    {q.tags.length > 3 ? " …" : ""}
                  </span>
                ) : null}
              </div>
              <div style={{ opacity: 0.9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                “{q.text}”
              </div>
            </div>
          </label>
        ))}
      </div>

      <div style={actions}>
        <button
          type="submit"
          style={{ ...primaryBtn, ...(disabled ? btnDisabled : {}) }}
          disabled={disabled}
          title="Generate export"
        >
          ⚙️ Generate Export
        </button>
      </div>
    </form>
  );
}

function formatTime(t) {
  if (t === null || t === undefined) return "—";
  if (typeof t !== "number" || Number.isNaN(t)) return "—";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const wrap = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const row = {
  display: "flex",
  alignItems: "flex-end",
  gap: 12,
  flexWrap: "wrap",
};

const group = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 160,
};

const label = {
  fontSize: 12,
  opacity: 0.8,
};

const select = {
  background: "transparent",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "8px 10px",
};

const input = {
  background: "transparent",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "8px 10px",
};

const listHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  marginTop: 4,
};

const quoteList = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  maxHeight: 320,
  overflow: "auto",
  paddingRight: 2,
};

const quoteItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  border: "1px solid var(--border-color)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.03))",
  borderRadius: 10,
  padding: 10,
};

const emptyBox = {
  padding: 10,
  border: "1px dashed var(--border-color)",
  borderRadius: 10,
  opacity: 0.85,
};

const actions = {
  display: "flex",
  gap: 8,
  marginTop: 4,
};

const chipSmall = {
  fontSize: 11,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid var(--border-color)",
};

const chipTime = {
  fontSize: 12,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(97,218,251,0.22)",
  border: "1px solid var(--border-color)",
  color: "#0b0b0b",
  fontWeight: 700,
  letterSpacing: 0.2,
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

const btnDisabled = {
  opacity: 0.5,
  cursor: "not-allowed",
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
