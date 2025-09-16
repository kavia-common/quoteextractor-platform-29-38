import React, { useEffect, useMemo, useState } from "react";
import { getExportJob } from "../api/client";

/**
 * ExportResult
 * Displays export job state with:
 * - Animated pending/processing indicator
 * - Status badge, timestamps, and errors
 * - Download button (uses /api/exports/{id}?download=1)
 * - Inline preview for text and JSON results
 *
 * Props:
 * - job: ExportJob | null
 * - submitting: boolean
 * - error: string
 * - onRefresh: () => Promise<void>
 */
export default function ExportResult({ job, submitting = false, error = "", onRefresh }) {
  const [preview, setPreview] = useState("");
  const [previewType, setPreviewType] = useState("text"); // "text" | "json"
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const statusBadge = useMemo(() => {
    const text = (job?.status || (submitting ? "processing" : "pending")).toString();
    const colorMap = {
      pending: "#FFB020",
      processing: "#61dafb",
      completed: "#22C55E",
      failed: "#EF4444",
      canceled: "#9CA3AF",
    };
    const color = colorMap[text] || "#61dafb";
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.3,
        color: "#0b0b0b",
        background: color
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0b0b0b", opacity: 0.4 }} />
        {String(text).toUpperCase()}
      </span>
    );
  }, [job?.status, submitting]);

  // Fetch preview content when job completed
  useEffect(() => {
    let active = true;
    (async () => {
      if (!job?.id || job?.status !== "completed") {
        setPreview("");
        setPreviewError("");
        return;
      }
      setLoadingPreview(true);
      setPreviewError("");
      try {
        // When download=1, backend returns raw output (text or JSON string)
        const res = await getExportJob(job.id, { download: 1 });
        if (!active) return;
        if (typeof res === "string") {
          setPreview(res);
          setPreviewType("text");
        } else if (typeof res === "object" && res !== null) {
          setPreview(JSON.stringify(res, null, 2));
          setPreviewType("json");
        } else {
          setPreview(String(res));
          setPreviewType("text");
        }
      } catch (e) {
        if (!active) return;
        setPreviewError(e?.payload?.detail || e?.message || "Failed to load preview.");
      } finally {
        if (active) setLoadingPreview(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [job?.id, job?.status]);

  const onDownload = async () => {
    if (!job?.id) return;
    try {
      const res = await getExportJob(job.id, { download: 1 });
      // Create a file locally and trigger download
      let blob;
      let filename = `export-${job.id}.${inferExtension(job?.format)}`;
      if (typeof res === "string") {
        const type = job?.format === "json" ? "application/json" : "text/plain";
        blob = new Blob([res], { type });
      } else if (typeof res === "object") {
        const json = JSON.stringify(res, null, 2);
        blob = new Blob([json], { type: "application/json" });
        filename = `export-${job.id}.json`;
      } else {
        const text = String(res ?? "");
        blob = new Blob([text], { type: "text/plain" });
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(url);
      }, 0);
    } catch {
      // Surface via preview error area
      setPreviewError("Download failed. Try again.");
    }
  };

  const showProgress = submitting || job?.status === "processing" || job?.status === "pending";

  return (
    <div style={wrap}>
      {!job && !submitting && !error && (
        <div style={placeholder}>
          <div style={iconBadge}>📦</div>
          <div style={{ fontWeight: 700, marginTop: 6 }}>No export generated yet</div>
          <div style={{ opacity: 0.8, fontSize: 13 }}>
            Configure options and click “Generate Export” to see results here.
          </div>
        </div>
      )}

      {!!error && !job && (
        <div role="alert" style={errorStyle}>
          {error}
        </div>
      )}

      {(job || submitting) && (
        <>
          <div style={header}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontWeight: 700, letterSpacing: 0.3 }}>
                Export Job
              </div>
              {statusBadge}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={onRefresh}
                style={miniGhostBtn}
                disabled={!job || showProgress}
                title="Refresh status"
              >
                Refresh
              </button>
              <button
                onClick={onDownload}
                style={{ ...miniPrimaryBtn, ...(showProgress || job?.status !== "completed" ? btnDisabled : {}) }}
                disabled={showProgress || job?.status !== "completed"}
                title="Download result"
              >
                ⬇️ Download
              </button>
            </div>
          </div>

          {showProgress && (
            <div style={progressWrap}>
              <div style={progressBar} />
              <div style={progressNote}>Preparing your export…</div>
            </div>
          )}

          {!!job?.error_message && (
            <div role="alert" style={errorStyle}>
              {job.error_message}
            </div>
          )}

          {!!job?.id && (
            <ul style={metaList}>
              <li>
                Job ID: <code>{job.id}</code>
              </li>
              <li>
                Format: <span style={{ opacity: 0.9 }}>{job.format}</span>
              </li>
              <li>
                Quotes: <span style={{ opacity: 0.9 }}>{job.quote_ids?.length || 0}</span>
              </li>
              <li>
                Created: <span style={{ opacity: 0.9 }}>{job.created_at ? new Date(job.created_at).toLocaleString() : "—"}</span>
              </li>
              <li>
                Updated: <span style={{ opacity: 0.9 }}>{job.updated_at ? new Date(job.updated_at).toLocaleString() : "—"}</span>
              </li>
            </ul>
          )}

          {job?.status === "completed" && (
            <>
              {loadingPreview && <div style={loadingBox}>Generating preview…</div>}
              {!!previewError && (
                <div role="alert" style={errorStyle}>
                  {previewError}
                </div>
              )}
              {!loadingPreview && !previewError && !!preview && (
                <div style={previewWrap}>
                  <div style={previewToolbar}>
                    <span style={{ fontWeight: 700 }}>Preview</span>
                    <span style={chipSmall}>{previewType.toUpperCase()}</span>
                  </div>
                  {previewType === "json" ? (
                    <pre style={codeBlock}>{preview}</pre>
                  ) : (
                    <pre style={textBlock}>{preview}</pre>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

const chipSmall = {
  fontSize: 11,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid var(--border-color)",
};

function inferExtension(format) {
  const map = {
    json: "json",
    srt: "srt",
    vtt: "vtt",
    twitter: "txt",
    linkedin: "txt",
    instagram: "txt",
    plain_text: "txt",
  };
  return map[format] || "txt";
}

const wrap = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  minHeight: 180,
};

const placeholder = {
  border: "1px dashed var(--border-color)",
  borderRadius: 12,
  padding: 16,
  textAlign: "center",
  opacity: 0.9,
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
  fontSize: 24,
};

const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const progressWrap = {
  width: "100%",
  border: "1px solid var(--border-color)",
  borderRadius: 12,
  padding: 10,
  background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.04))",
};

const progressBar = {
  width: "48%",
  height: 8,
  borderRadius: 999,
  background: "linear-gradient(90deg, rgba(97,218,251,0.9), rgba(34,197,94,0.9))",
  animation: "progress-pulse 1.1s ease-in-out infinite alternate",
};

const progressNote = {
  fontSize: 12,
  opacity: 0.75,
  marginTop: 6,
};

const metaList = {
  margin: "6px 0 0",
  paddingLeft: 18,
  lineHeight: 1.7,
};

const loadingBox = {
  marginTop: 6,
  padding: 12,
  border: "1px dashed var(--border-color)",
  borderRadius: 10,
  opacity: 0.85,
};

const errorStyle = {
  marginTop: 6,
  padding: 12,
  border: "1px solid rgba(239,68,68,0.4)",
  background: "rgba(239,68,68,0.08)",
  color: "#EF4444",
  borderRadius: 10,
  fontWeight: 600,
};

const previewWrap = {
  border: "1px solid var(--border-color)",
  borderRadius: 12,
  overflow: "hidden",
};

const previewToolbar = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  justifyContent: "space-between",
  padding: "8px 10px",
  background: "var(--bg-secondary)",
  borderBottom: "1px solid var(--border-color)",
};

const codeBlock = {
  margin: 0,
  padding: 12,
  background: "rgba(0,0,0,0.3)",
  color: "var(--text-primary)",
  fontSize: 12.5,
  overflow: "auto",
  maxHeight: 300,
};

const textBlock = {
  margin: 0,
  padding: 12,
  background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.03))",
  color: "var(--text-primary)",
  fontSize: 13.5,
  lineHeight: 1.5,
  overflow: "auto",
  maxHeight: 300,
  whiteSpace: "pre-wrap",
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

// Inject keyframes for progress bar
if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
@keyframes progress-pulse {
  from { transform: translateX(-25%); opacity: 0.7; }
  to { transform: translateX(85%); opacity: 1; }
}
`;
  document.head.appendChild(styleTag);
}
