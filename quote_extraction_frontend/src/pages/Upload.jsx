import React from "react";

/**
 * Upload Page - placeholder
 * Shows a minimal instruction; integration with real upload will come later.
 */
export default function Upload() {
  return (
    <section>
      <h1 className="title">Upload</h1>
      <p className="description">
        Upload audio/video files to begin transcript generation and quote extraction.
      </p>
      <div style={boxStyle}>
        <p style={{ margin: 0 }}>Drag and drop files here or click to select.</p>
      </div>
    </section>
  );
}

const boxStyle = {
  marginTop: 16,
  padding: 24,
  border: "2px dashed var(--border-color)",
  borderRadius: 12,
  color: "var(--text-primary)",
  background: "var(--bg-secondary)",
};
