import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
import UploadForm from "../components/UploadForm";
import { getUploadStatus } from "../api/client";

/**
 * UploadPage provides a polished upload experience with:
 * - Drag & drop upload
 * - Progress and status feedback
 * - Polling backend for processing status once uploaded
 * - Integrated modern styling
 *
 * Note: Layout, navigation, and theme are managed by App.js. This page renders core content only.
 */
export default function UploadPage() {
  const [assetId, setAssetId] = useState(null);
  const [statusInfo, setStatusInfo] = useState(null);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState("");

  // Poll for status after we have an assetId
  useEffect(() => {
    let active = true;
    if (!assetId) return;

    setPolling(true);
    const interval = setInterval(async () => {
      try {
        const res = await getUploadStatus(assetId);
        if (!active) return;
        setStatusInfo(res);
        if (res?.status === "completed" || res?.status === "failed" || res?.status === "canceled") {
          clearInterval(interval);
          setPolling(false);
        }
      } catch (e) {
        if (!active) return;
        // Stop polling on hard errors, surface message
        setError(e?.payload?.message || e?.message || "Failed to check status.");
        clearInterval(interval);
        setPolling(false);
      }
    }, 1500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [assetId]);

  const statusBadge = useMemo(() => {
    if (!statusInfo) return null;
    const colorMap = {
      pending: "#FFB020",
      processing: "#61dafb",
      completed: "#22C55E",
      failed: "#EF4444",
      canceled: "#9CA3AF",
      queued: "#FFB020",
    };
    const text = (statusInfo.status || "pending").toString();
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
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "#0b0b0b", opacity: 0.4
        }} />
        {text.toUpperCase()}
      </span>
    );
  }, [statusInfo]);

  return (
    <section style={heroWrapStyle}>
      <div style={heroGlowStyle} aria-hidden="true" />
      <div style={heroCardStyle}>
        <div style={eyebrowStyle}>Media Ingestion</div>
        <h1 style={heroTitleStyle}>Upload audio & video to extract standout quotes</h1>
        <p style={heroSubtitleStyle}>
          Drag and drop files or browse from your computer. We’ll transcribe and prepare your content for quote extraction, editing, and export.
        </p>
        <UploadForm
          onUploaded={(r) => {
            setError("");
            setStatusInfo(null);
            setAssetId(r.asset_id);
          }}
          onError={(msg) => {
            setError(msg);
          }}
        />
        {assetId && (
          <div style={statusPanelStyle} role="status" aria-live="polite">
            <div style={statusHeaderStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 700, letterSpacing: 0.3 }}>Processing Status</span>
                {statusBadge}
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                Asset ID: <code>{assetId}</code>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              {polling && (
                <div style={progressWrap}>
                  <div style={progressBar} />
                </div>
              )}
              <ul style={statusListStyle}>
                <li>
                  Updated:{" "}
                  <span style={{ opacity: 0.9 }}>
                    {statusInfo?.updated_at ? new Date(statusInfo.updated_at).toLocaleString() : "—"}
                  </span>
                </li>
                <li>
                  Transcript ID:{" "}
                  <span style={{ opacity: 0.9 }}>
                    {statusInfo?.transcript_id || "Not available yet"}
                  </span>
                </li>
                {statusInfo?.message && (
                  <li>
                    Message: <span style={{ opacity: 0.9 }}>{statusInfo.message}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
        {!!error && (
          <div role="alert" style={errorStyle}>
            {error}
          </div>
        )}
        <div style={tipsStyle}>
          Pro tip: Large files may take a while. You can keep this tab open—status updates in real time.
        </div>
      </div>
    </section>
  );
}

const heroWrapStyle = {
  position: "relative",
  padding: "32px 16px",
};

const heroGlowStyle = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(1200px 400px at 50% -10%, rgba(97,218,251,0.12), transparent), radial-gradient(900px 400px at 0% 20%, rgba(34,197,94,0.08), transparent)",
  pointerEvents: "none",
};

const heroCardStyle = {
  position: "relative",
  border: "1px solid var(--border-color)",
  background:
    "linear-gradient(150deg, rgba(255,255,255,0.02), rgba(255,255,255,0.04))",
  backdropFilter: "blur(6px)",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
};

const eyebrowStyle = {
  display: "inline-block",
  fontSize: 12,
  letterSpacing: 1.2,
  textTransform: "uppercase",
  color: "var(--text-secondary)",
  padding: "6px 10px",
  border: "1px solid var(--border-color)",
  borderRadius: 999,
  marginBottom: 12,
};

const heroTitleStyle = {
  margin: "10px 0 8px",
  fontSize: 28,
  lineHeight: 1.2,
};

const heroSubtitleStyle = {
  margin: "0 0 18px",
  opacity: 0.85,
};

const statusPanelStyle = {
  marginTop: 18,
  padding: 14,
  borderRadius: 12,
  border: "1px solid var(--border-color)",
  background: "var(--bg-secondary)",
};

const statusHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const statusListStyle = {
  margin: "10px 0 0",
  paddingLeft: 18,
  lineHeight: 1.7,
};

const progressWrap = {
  width: "100%",
  height: 8,
  borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
  overflow: "hidden",
  border: "1px solid var(--border-color)",
};

const progressBar = {
  width: "45%",
  height: "100%",
  background:
    "linear-gradient(90deg, rgba(97,218,251,0.9), rgba(34,197,94,0.9))",
  animation: "progress-pulse 1.2s ease-in-out infinite alternate",
};

const errorStyle = {
  marginTop: 14,
  padding: 12,
  border: "1px solid rgba(239,68,68,0.4)",
  background: "rgba(239,68,68,0.08)",
  color: "#EF4444",
  borderRadius: 10,
  fontWeight: 600,
};

const tipsStyle = {
  marginTop: 16,
  fontSize: 12,
  opacity: 0.7,
};

// Add keyframes via a style tag injection (safe for CRA)
const styleTag = document.createElement("style");
styleTag.innerHTML = `
@keyframes progress-pulse {
  from { transform: translateX(-30%); opacity: 0.7; }
  to { transform: translateX(85%); opacity: 1; }
}
`;
if (typeof document !== "undefined") {
  document.head.appendChild(styleTag);
}
