import React from "react";

/**
 * QuoteFilters
 * Smart filter bar:
 * - Status: all | approved | pending
 * - Min Confidence: 0..1 (step 0.05)
 * - Tags: comma-separated contains filter (client-side)
 * - Refresh button
 */
export default function QuoteFilters({
  status,
  onStatusChange,
  minConfidence,
  onMinConfidenceChange,
  tagQuery,
  onTagQueryChange,
  onRefresh,
  loading = false,
}) {
  return (
    <div style={wrap}>
      <div style={row}>
        <div style={group}>
          <label htmlFor="status" style={label}>
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            style={select}
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div style={group}>
          <label htmlFor="min-conf" style={label}>
            Min Confidence
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              id="min-conf"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={minConfidence}
              onChange={(e) => onMinConfidenceChange(parseFloat(e.target.value))}
              style={{ width: 180 }}
            />
            <span style={chipSmall}>{minConfidence.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ ...group, flex: 1 }}>
          <label htmlFor="tags" style={label}>
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            placeholder="e.g. product, funny"
            value={tagQuery}
            onChange={(e) => onTagQueryChange(e.target.value)}
            style={input}
          />
        </div>

        <div style={{ ...group, alignSelf: "flex-end" }}>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{ ...primaryBtn, ...(loading ? btnDisabled : {}) }}
            aria-busy={loading ? "true" : undefined}
            title="Refresh from server"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
}

const wrap = {
  border: "1px solid var(--border-color)",
  background: "var(--bg-secondary)",
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
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
  opacity: 0.75,
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
  width: "100%",
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

const btnDisabled = {
  opacity: 0.5,
  cursor: "not-allowed",
};
