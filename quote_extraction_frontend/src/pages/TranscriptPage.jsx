import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
import Layout from "../components/Layout";
import TranscriptEditor from "../components/TranscriptEditor";
import {
  getTranscript,
  listTranscripts,
  updateTranscript,
  extractQuotes,
} from "../api/client";

/**
 * TranscriptPage
 * A polished page to:
 * - Load a transcript (selectable via simple dropdown)
 * - Edit transcript inline with a refined editor
 * - Save to backend (PUT /api/transcripts/{id})
 * - Extract quotes with a clear CTA (POST /api/quotes/extract)
 * - Maintain the modern style established on the Upload page
 */
export default function TranscriptPage() {
  const [theme, setTheme] = useState("light");
  const [current, setCurrent] = useState("transcript");

  const [transcripts, setTranscripts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [transcript, setTranscript] = useState(null);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoadingList(true);
      setError("");
      try {
        const res = await listTranscripts();
        if (!active) return;
        const items = Array.isArray(res) ? res : res?.items || res?.data || [];
        setTranscripts(items);
        if (items?.length && !selectedId) {
          setSelectedId(items[0]?.id || "");
        }
      } catch (e) {
        if (!active) return;
        setError(e?.payload?.detail || e?.message || "Failed to list transcripts.");
      } finally {
        if (active) setLoadingList(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []); // load once

  useEffect(() => {
    if (!selectedId) {
      setTranscript(null);
      return;
    }
    let active = true;
    (async () => {
      setLoadingTranscript(true);
      setError("");
      setTranscript(null);
      try {
        const res = await getTranscript(selectedId);
        if (!active) return;
        setTranscript(res);
      } catch (e) {
        if (!active) return;
        setError(e?.payload?.detail || e?.message || "Failed to load transcript.");
      } finally {
        if (active) setLoadingTranscript(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedId]);

  // Handle save
  const onSave = async () => {
    if (!transcript?.id) return;
    setSaving(true);
    setError("");
    setFlash("");
    try {
      const payload = {
        text: transcript.text ?? "",
        language: transcript.language ?? null,
        status: transcript.status ?? null,
      };
      const updated = await updateTranscript(transcript.id, payload);
      setTranscript(updated);
      setFlash("Saved successfully.");
      setTimeout(() => setFlash(""), 1500);
    } catch (e) {
      setError(e?.payload?.detail || e?.message || "Failed to save transcript.");
    } finally {
      setSaving(false);
    }
  };

  // Handle extract quotes
  const onExtractQuotes = async () => {
    if (!transcript?.id && !transcript?.text) return;
    setError("");
    setFlash("");
    try {
      await extractQuotes({
        transcript_id: transcript.id || null,
        text: transcript.text || null,
        max_candidates: 6,
        min_length: 24,
      });
      setFlash("Quote candidates extracted. Visit Quotes tab to review.");
      setTimeout(() => setFlash(""), 2500);
    } catch (e) {
      setError(e?.payload?.detail || e?.message || "Failed to extract quotes.");
    }
  };

  const headerBadge = useMemo(() => {
    const status = transcript?.status || "—";
    const colorMap = {
      pending: "#FFB020",
      processing: "#61dafb",
      completed: "#22C55E",
      failed: "#EF4444",
      canceled: "#9CA3AF",
      "—": "rgba(255,255,255,0.1)",
    };
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 10px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.3,
          color: "#0b0b0b",
          background: colorMap[status] || "#61dafb",
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0b0b0b", opacity: 0.4 }} />
        {String(status).toUpperCase()}
      </span>
    );
  }, [transcript?.status]);

  return (
    <Layout
      current={current}
      onNavigate={setCurrent}
      onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      theme={theme}
    >
      <section style={heroWrapStyle}>
        <div style={heroGlowStyle} aria-hidden="true" />
        <div style={heroCardStyle}>
          <div style={eyebrowStyle}>Review</div>
          <h1 style={heroTitleStyle}>Refine your transcript and pull standout quotes</h1>
          <p style={heroSubtitleStyle}>
            Edit the transcript inline, manage segments, and start extracting quotes in a single flow.
          </p>

          <div style={toolbar}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label htmlFor="transcript-select" style={{ fontSize: 12, opacity: 0.8 }}>
                Transcript
              </label>
              <select
                id="transcript-select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                disabled={loadingList}
                style={selectStyle}
              >
                {!transcripts?.length && <option value="">No transcripts</option>}
                {transcripts?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} {t.language ? `(${t.language})` : ""}
                  </option>
                ))}
              </select>
              {headerBadge}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              {transcript?.asset_id && (
                <>
                  Asset: <code>{transcript.asset_id}</code>
                </>
              )}
            </div>
          </div>

          {loadingTranscript && <div style={loadingBox}>Loading transcript…</div>}

          {transcript && !loadingTranscript && (
            <TranscriptEditor
              transcript={transcript}
              onChange={(txt) => setTranscript((prev) => ({ ...(prev || {}), text: txt }))}
              onSave={onSave}
              saving={saving}
              onExtractQuotes={onExtractQuotes}
              error={error}
            />
          )}

          {!!error && !transcript && (
            <div role="alert" style={errorStyle}>
              {error}
            </div>
          )}
          {!!flash && (
            <div role="status" style={flashStyle} aria-live="polite">
              {flash}
            </div>
          )}
        </div>
      </section>
    </Layout>
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
  background: "linear-gradient(150deg, rgba(255,255,255,0.02), rgba(255,255,255,0.04))",
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

const toolbar = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 12,
};

const selectStyle = {
  background: "transparent",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "8px 10px",
};

const loadingBox = {
  marginTop: 10,
  padding: 12,
  border: "1px dashed var(--border-color)",
  borderRadius: 10,
  opacity: 0.85,
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

const flashStyle = {
  marginTop: 12,
  padding: 10,
  border: "1px solid rgba(34,197,94,0.4)",
  background: "rgba(34,197,94,0.08)",
  color: "#22C55E",
  borderRadius: 10,
  fontWeight: 600,
};
