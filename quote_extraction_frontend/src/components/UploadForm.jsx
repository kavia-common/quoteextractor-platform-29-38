import React, { useCallback, useRef, useState } from "react";
import { uploadAsset } from "../api/client";

/**
 * UploadForm provides:
 * - Drag & drop + click-to-browse
 * - File preview chip
 * - Stylish action buttons
 * - Progress indicator (client-side simulated)
 * - API integration with uploadAsset
 *
 * Props:
 * - onUploaded: function({ asset_id, status, asset? }) -> void
 * - onError: function(message: string) -> void
 */
export default function UploadForm({ onUploaded, onError }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [note, setNote] = useState("");

  const onSelectClick = () => inputRef.current?.click();

  const handleFiles = (files) => {
    const f = files?.[0];
    if (!f) return;
    setFile(f);
    setNote("");
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragActive) setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const reset = useCallback(() => {
    setFile(null);
    setBusy(false);
    setProgress(0);
    setNote("");
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const simulateProgress = useCallback(() => {
    // Since fetch doesn't expose upload progress, simulate a quick progress stepper
    let p = 5;
    setProgress(p);
    const timer = setInterval(() => {
      p = Math.min(p + Math.random() * 18, 85);
      setProgress(p);
      if (p >= 85) clearInterval(timer);
    }, 180);
    return () => clearInterval(timer);
  }, []);

  const doUpload = async () => {
    if (!file) {
      setNote("Please choose a file to upload.");
      return;
    }
    setBusy(true);
    setNote("");
    const stopSim = simulateProgress();
    try {
      const res = await uploadAsset(file, {});
      // finalize progress animation
      setProgress(100);
      setTimeout(() => setBusy(false), 250);
      if (onUploaded) onUploaded(res);
      setNote("Upload registered successfully. Tracking processing status...");
    } catch (e) {
      setBusy(false);
      if (onError) onError(e?.payload?.detail || e?.message || "Upload failed.");
      setNote("Upload failed.");
    } finally {
      stopSim();
    }
  };

  return (
    <div style={wrapStyle}>
      <div
        style={{
          ...dropStyle,
          ...(dragActive ? dropActiveStyle : {}),
          ...(busy ? dropBusyStyle : {}),
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={!busy ? onSelectClick : undefined}
        role="button"
        aria-label="Upload media via drag and drop or click to browse"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !busy) onSelectClick();
        }}
      >
        <div style={dropInnerStyle}>
          <div style={iconBadge}>
            <span role="img" aria-label="upload">📤</span>
          </div>
          <div style={dropTitle}>Drag & drop your file here</div>
          <div style={dropSubtitle}>
            or <span style={{ color: "var(--text-secondary)", fontWeight: 700 }}>browse</span> to select
          </div>
          <input
            ref={inputRef}
            type="file"
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: "none" }}
            accept="audio/*,video/*"
          />
        </div>
      </div>

      {file && (
        <div style={fileChip} aria-live="polite">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🎞️</span>
            <div>
              <div style={{ fontWeight: 700 }}>{file.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || "unknown"}
              </div>
            </div>
          </div>
          <button
            onClick={reset}
            disabled={busy}
            style={chipRemove}
            aria-label="Remove selected file"
            title="Remove"
          >
            ×
          </button>
        </div>
      )}

      {busy && (
        <div style={progressBlock} aria-live="polite">
          <div style={progressTrack}>
            <div style={{ ...progressFill, width: `${progress}%` }} />
          </div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
            Uploading... {Math.round(progress)}%
          </div>
        </div>
      )}

      <div style={actionsRow}>
        <button
          onClick={doUpload}
          disabled={!file || busy}
          style={{ ...primaryBtn, ...(busy || !file ? btnDisabled : {}) }}
        >
          <span style={{ marginRight: 8 }}>⬆️</span> Upload
        </button>
        <button onClick={reset} disabled={busy || !file} style={{ ...ghostBtn, ...(busy || !file ? btnDisabled : {}) }}>
          Reset
        </button>
      </div>

      {!!note && <div style={noteStyle}>{note}</div>}

      <div style={smallHint}>
        Supported: common audio/video formats. For best results, keep files under a few hundred MB.
      </div>
    </div>
  );
}

const wrapStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const dropStyle = {
  position: "relative",
  border: "2px dashed var(--border-color)",
  borderRadius: 14,
  background: "var(--bg-secondary)",
  transition: "all 0.25s ease",
  cursor: "pointer",
  overflow: "hidden",
};

const dropActiveStyle = {
  borderColor: "rgba(97,218,251,0.75)",
  boxShadow: "0 0 0 4px rgba(97,218,251,0.15) inset",
  transform: "translateY(-1px)",
};

const dropBusyStyle = {
  opacity: 0.7,
  cursor: "not-allowed",
};

const dropInnerStyle = {
  padding: "24px 16px",
  textAlign: "center",
};

const iconBadge = {
  width: 54,
  height: 54,
  borderRadius: 12,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(180deg, rgba(97,218,251,0.2), rgba(97,218,251,0.05))",
  border: "1px solid var(--border-color)",
  marginBottom: 10,
  fontSize: 24,
};

const dropTitle = {
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: 0.3,
};

const dropSubtitle = {
  fontSize: 13,
  opacity: 0.8,
  marginTop: 4,
};

const fileChip = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  border: "1px solid var(--border-color)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.03))",
  borderRadius: 12,
  padding: "10px 12px",
};

const chipRemove = {
  border: "1px solid var(--border-color)",
  background: "transparent",
  color: "var(--text-primary)",
  width: 30,
  height: 30,
  borderRadius: 8,
  fontSize: 18,
  lineHeight: "18px",
  cursor: "pointer",
};

const progressBlock = {
  marginTop: 4,
};

const progressTrack = {
  width: "100%",
  height: 10,
  borderRadius: 999,
  background: "rgba(255,255,255,0.06)",
  overflow: "hidden",
  border: "1px solid var(--border-color)",
};

const progressFill = {
  height: "100%",
  borderRadius: 999,
  background: "linear-gradient(90deg, #61dafb, #22c55e)",
  transition: "width 0.25s ease",
};

const actionsRow = {
  display: "flex",
  gap: 10,
  marginTop: 4,
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

const ghostBtn = {
  background: "transparent",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 10,
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

const btnDisabled = {
  opacity: 0.5,
  cursor: "not-allowed",
};

const noteStyle = {
  fontSize: 13,
  marginTop: 2,
  opacity: 0.85,
};

const smallHint = {
  fontSize: 12,
  opacity: 0.6,
};
