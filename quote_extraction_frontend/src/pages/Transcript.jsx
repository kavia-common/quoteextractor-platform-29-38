import React from "react";

/**
 * Transcript Page - placeholder
 * Shows instructions and a sample area where transcript text would display.
 */
export default function Transcript() {
  return (
    <section>
      <h1 className="title">Transcript</h1>
      <p className="description">
        View and edit generated transcripts. Version history and audit logs will appear here.
      </p>
      <div style={panelStyle}>
        <h3 style={{ marginTop: 0 }}>Transcript Preview</h3>
        <p style={{ opacity: 0.8 }}>
          Once a file is processed, the transcript text and segments will be displayed here for review and edits.
        </p>
      </div>
    </section>
  );
}

const panelStyle = {
  marginTop: 16,
  padding: 16,
  borderRadius: 10,
  border: "1px solid var(--border-color)",
  background: "var(--bg-secondary)",
};
