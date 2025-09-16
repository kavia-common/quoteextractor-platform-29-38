import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
import ExportForm from "../components/ExportForm";
import ExportResult from "../components/ExportResult";
import { createExportJob, getExportJob, listQuotes } from "../api/client";

/**
 * ExportPage
 * A visually polished page to:
 * - Choose export format and platform style
 * - Select which approved quotes to include
 * - Submit an export job and fetch/download results
 * - Provide animated status and rich result previews
 */
export default function ExportPage() {
  // Quotes and selection
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [quotesError, setQuotesError] = useState("");

  // Job state
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [jobError, setJobError] = useState("");

  // Load approved quotes for selection
  useEffect(() => {
    let active = true;
    (async () => {
      setLoadingQuotes(true);
      setQuotesError("");
      try {
        const res = await listQuotes({ status: "approved" });
        if (!active) return;
        const items = Array.isArray(res) ? res : res?.items || res?.data || [];
        setQuotes(items);
      } catch (e) {
        if (!active) return;
        setQuotesError(e?.payload?.detail || e?.message || "Failed to load quotes.");
      } finally {
        if (active) setLoadingQuotes(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const onSubmitExport = async (formValues) => {
    setSubmitting(true);
    setJobError("");
    setJob(null);
    try {
      const payload = {
        quote_ids: formValues.quoteIds,
        format: formValues.format,
        title: formValues.title || null,
        author: formValues.author || null,
      };
      const res = await createExportJob(payload);
      // wrap: some backend returns { export: {...} } - normalize
      const created = res?.export || res;
      setJob(created);
    } catch (e) {
      setJobError(e?.payload?.detail || e?.message || "Failed to create export.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to refresh job (for safety if later made async on server)
  const refreshJob = async () => {
    if (!job?.id) return;
    try {
      const res = await getExportJob(job.id);
      const next = res?.export || res;
      setJob(next);
    } catch (e) {
      setJobError(e?.payload?.detail || e?.message || "Failed to refresh export job.");
    }
  };

  const hasQuotes = useMemo(() => quotes && quotes.length > 0, [quotes]);

  return (
    <section style={heroWrapStyle}>
      <div style={heroGlowStyle} aria-hidden="true" />
      <div style={heroCardStyle} className="export-hero-card">
        <div style={eyebrowStyle}>Distribute</div>
        <h1 style={heroTitleStyle}>Export curated quotes for your channels</h1>
        <p style={heroSubtitleStyle}>
          Choose format and platform styling, pick approved quotes, and generate polished output ready
          for social posts, blogs, or captions.
        </p>

        <div style={grid} className="export-grid">
          <div style={leftCol}>
            <h3 style={panelTitle}>Export Options</h3>
            {loadingQuotes && <div style={loadingBox}>Loading approved quotes…</div>}
            {!!quotesError && (
              <div role="alert" style={errorStyle}>
                {quotesError}
              </div>
            )}
            {!loadingQuotes && !quotesError && (
              <ExportForm
                quotes={quotes}
                disabled={!hasQuotes || submitting}
                onSubmit={onSubmitExport}
              />
            )}
            {!hasQuotes && !loadingQuotes && !quotesError && (
              <div style={hintBox}>
                No approved quotes found. Approve quotes on the Quotes tab to enable exporting.
              </div>
            )}
          </div>

          <div style={rightCol}>
            <h3 style={panelTitle}>Result</h3>
            <ExportResult
              job={job}
              submitting={submitting}
              error={jobError}
              onRefresh={refreshJob}
            />
          </div>
        </div>

        <div style={tipsStyle}>
          Tip: For social platforms, keep each quote concise and add tags in the post body for reach.
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
  background: "linear-gradient(150deg, rgba(255,255,255,0.02), rgba(255,255,255,0.04))",
  backdropFilter: "blur(6px)",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  maxWidth: "100%",
  overflow: "hidden",
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

const grid = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: 14,
  "@media (max-width: 1024px)": {
    gridTemplateColumns: "1fr",
  },
};

const leftCol = {
  border: "1px solid var(--border-color)",
  background: "var(--bg-secondary)",
  borderRadius: 14,
  padding: 12,
  minWidth: 0,
  overflow: "hidden",
};

const rightCol = {
  border: "1px solid var(--border-color)",
  background: "var(--bg-secondary)",
  borderRadius: 14,
  padding: 12,
  minHeight: 280,
  minWidth: 0,
  overflow: "hidden",
};

const panelTitle = {
  marginTop: 0,
  marginBottom: 10,
};

const loadingBox = {
  marginTop: 6,
  padding: 12,
  border: "1px dashed var(--border-color)",
  borderRadius: 10,
  opacity: 0.85,
};

const errorStyle = {
  marginTop: 8,
  padding: 12,
  border: "1px solid rgba(239,68,68,0.4)",
  background: "rgba(239,68,68,0.08)",
  color: "#EF4444",
  borderRadius: 10,
  fontWeight: 600,
};

const hintBox = {
  marginTop: 8,
  padding: 12,
  border: "1px dashed var(--border-color)",
  borderRadius: 10,
  opacity: 0.85,
};

const tipsStyle = {
  marginTop: 16,
  fontSize: 12,
  opacity: 0.7,
};

// Add responsive CSS for mobile layout
if (typeof document !== "undefined") {
  const existingStyle = document.querySelector("#export-page-responsive");
  if (!existingStyle) {
    const styleTag = document.createElement("style");
    styleTag.id = "export-page-responsive";
    styleTag.innerHTML = `
@media (max-width: 1024px) {
  .export-grid {
    grid-template-columns: 1fr !important;
  }
}
@media (max-width: 768px) {
  .export-hero-card {
    padding: 16px !important;
  }
}
`;
    document.head.appendChild(styleTag);
  }
}
