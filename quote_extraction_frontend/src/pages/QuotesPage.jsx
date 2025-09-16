import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
import { listQuotes, updateQuote } from "../api/client";
import QuoteFilters from "../components/QuoteFilters";
import QuoteList from "../components/QuoteList";

/**
 * QuotesPage
 * Displays extracted quotes with smart filtering and inline approve/reject controls.
 * Features:
 * - Filters: status (all/approved/pending), min confidence, tags (contains)
 * - Pageless list with smooth, elegant cards
 * - Inline actions (Approve / Reject) update backend and reflect immediately
 * - Subtle loading/error states and badges
 */
export default function QuotesPage() {
  // Filters
  const [status, setStatus] = useState("all"); // 'all' | 'approved' | 'pending'
  const [minConf, setMinConf] = useState(0);
  const [tagQuery, setTagQuery] = useState("");

  // Data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quotes, setQuotes] = useState([]);

  // Fetch quotes when server-facing filters change (status, minConfidence)
  const fetchQuotes = async () => {
    setLoading(true);
    setError("");
    try {
      // backend supports status (approved/pending) and minConfidence;
      // we send null for "all" to not filter.
      const serverStatus = status === "all" ? null : status;
      const res = await listQuotes({
        status: serverStatus,
        minConfidence: minConf > 0 ? minConf : null,
      });
      const list = Array.isArray(res) ? res : res?.items || res?.data || [];
      setQuotes(list);
    } catch (e) {
      setError(e?.payload?.detail || e?.message || "Failed to load quotes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, minConf]);

  // Client-side tag filter (contains any of tokens typed)
  const filteredQuotes = useMemo(() => {
    if (!tagQuery.trim()) return quotes;
    const tokens = tagQuery
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    if (!tokens.length) return quotes;
    return quotes.filter((q) => {
      const qtags = (q.tags || []).map((t) => String(t).toLowerCase());
      return tokens.every((tok) => qtags.some((qt) => qt.includes(tok)));
    });
  }, [quotes, tagQuery]);

  const onApprove = async (id) => {
    try {
      const updated = await updateQuote(id, { approved: true });
      setQuotes((prev) => prev.map((q) => (q.id === id ? updated : q)));
    } catch (e) {
      setError(e?.payload?.detail || e?.message || "Failed to approve quote.");
    }
  };

  const onReject = async (id) => {
    try {
      const updated = await updateQuote(id, { approved: false });
      setQuotes((prev) => prev.map((q) => (q.id === id ? updated : q)));
    } catch (e) {
      setError(e?.payload?.detail || e?.message || "Failed to reject quote.");
    }
  };

  return (
    <section style={heroWrapStyle}>
      <div style={heroGlowStyle} aria-hidden="true" />
      <div style={heroCardStyle}>
        <div style={eyebrowStyle}>Curation</div>
        <h1 style={heroTitleStyle}>Review and curate standout quotes</h1>
        <p style={heroSubtitleStyle}>
          Filter by status, confidence, and tags. Approve or reject quickly to prepare for export.
        </p>

        <QuoteFilters
          status={status}
          onStatusChange={setStatus}
          minConfidence={minConf}
          onMinConfidenceChange={setMinConf}
          tagQuery={tagQuery}
          onTagQueryChange={setTagQuery}
          onRefresh={fetchQuotes}
          loading={loading}
        />

        {loading && <div style={loadingBox}>Loading quotes…</div>}
        {!!error && (
          <div role="alert" style={errorStyle}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <QuoteList quotes={filteredQuotes} onApprove={onApprove} onReject={onReject} />
        )}

        <div style={tipsStyle}>
          Tip: Use tags like "product", "vision", or "funny" to organize your quotes for specific channels.
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

const tipsStyle = {
  marginTop: 16,
  fontSize: 12,
  opacity: 0.7,
};
