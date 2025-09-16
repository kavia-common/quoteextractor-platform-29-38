import React from "react";
import QuoteItem from "./QuoteItem";

/**
 * QuoteList
 * Renders a list of quotes in elegant cards with approve/reject actions.
 */
export default function QuoteList({ quotes = [], onApprove, onReject }) {
  if (!quotes?.length) {
    return (
      <div style={emptyBox}>
        No quotes to display. Try refreshing or adjusting your filters.
      </div>
    );
  }

  return (
    <div style={grid}>
      {quotes.map((q) => (
        <QuoteItem key={q.id} quote={q} onApprove={onApprove} onReject={onReject} />
      ))}
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 12,
};

const emptyBox = {
  padding: 14,
  border: "1px dashed var(--border-color)",
  borderRadius: 12,
  opacity: 0.85,
};
