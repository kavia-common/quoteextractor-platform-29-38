import React from "react";

/**
 * QuoteItem
 * Displays a single quote in a card:
 * - Text, timing badge, confidence, tags, status
 * - Approve / Reject buttons that call parent callbacks
 */
export default function QuoteItem({ quote, onApprove, onReject }) {
  const conf = typeof quote.confidence === "number" ? quote.confidence : null;
  const statusBadge = quote.approved ? approvedBadge : pendingBadge;

  return (
    <article style={card} aria-label="Quote item">
      <header style={cardHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={statusBadge}>{quote.approved ? "APPROVED" : "PENDING"}</span>
          {conf !== null && <span style={chip}>Conf: {conf.toFixed(2)}</span>}
          <span style={chipTime}>{formatTime(quote.start)} - {formatTime(quote.end)}</span>
        </div>
      </header>

      <blockquote style={quoteText}>"{quote.text}"</blockquote>

      {(quote.tags?.length ?? 0) > 0 && (
        <div style={tagsWrap} aria-label="Tags">
          {quote.tags.map((t, i) => (
            <span key={i} style={tag}>
              #{t}
            </span>
          ))}
        </div>
      )}

      <footer style={footer}>
        <button
          onClick={() => onApprove && onApprove(quote.id)}
          style={{ ...primaryBtn, ...(quote.approved ? btnDisabled : {}) }}
          disabled={!!quote.approved}
          title="Approve"
        >
          ✅ Approve
        </button>
        <button
          onClick={() => onReject && onReject(quote.id)}
          style={{ ...ghostBtn, ...(!quote.approved ? btnDisabled : {}) }}
          disabled={!quote.approved}
          title="Reject"
        >
          🚫 Reject
        </button>
      </footer>
    </article>
  );
}

function formatTime(t) {
  if (t === null || t === undefined) return "—";
  if (typeof t !== "number" || Number.isNaN(t)) return "—";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const card = {
  border: "1px solid var(--border-color)",
  background: "linear-gradient(150deg, rgba(255,255,255,0.02), rgba(255,255,255,0.04))",
  borderRadius: 14,
  padding: 12,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const cardHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const quoteText = {
  margin: 0,
  lineHeight: 1.55,
  fontSize: 14.5,
  whiteSpace: "pre-wrap",
};

const tagsWrap = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
};

const tag = {
  fontSize: 11.5,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid var(--border-color)",
};

const footer = {
  display: "flex",
  gap: 8,
  marginTop: "auto",
};

const chip = {
  fontSize: 12,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid var(--border-color)",
};

const chipTime = {
  fontSize: 12,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(97,218,251,0.2)",
  border: "1px solid var(--border-color)",
  color: "#0b0b0b",
  fontWeight: 700,
  letterSpacing: 0.2,
};

const approvedBadge = {
  fontSize: 11,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.85)",
  color: "#0b0b0b",
  fontWeight: 800,
  letterSpacing: 0.3,
  border: "1px solid transparent",
};

const pendingBadge = {
  fontSize: 11,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(255,176,32,0.9)",
  color: "#0b0b0b",
  fontWeight: 800,
  letterSpacing: 0.3,
  border: "1px solid transparent",
};

const primaryBtn = {
  background: "linear-gradient(90deg, rgba(97,218,251,0.9), rgba(34,197,94,0.9))",
  color: "#0b0b0b",
  border: "none",
  borderRadius: 10,
  padding: "8px 12px",
  fontWeight: 800,
  letterSpacing: 0.2,
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
};

const ghostBtn = {
  background: "transparent",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 10,
  padding: "8px 12px",
  fontWeight: 700,
  cursor: "pointer",
};

const btnDisabled = {
  opacity: 0.6,
  cursor: "not-allowed",
};
