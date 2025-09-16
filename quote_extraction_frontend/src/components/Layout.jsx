import React from "react";
import "../App.css";

/**
 * Layout component with a minimal top navigation bar.
 * Provides a consistent shell for the app pages and a theme toggle hook.
 *
 * Props:
 * - current: string - the current active section key
 * - onNavigate: function - handler receiving the target section key
 * - onToggleTheme: function - handler to toggle theme
 * - theme: string - "light" | "dark"
 * - children: React.ReactNode - page content
 */
export default function Layout({ current, onNavigate, onToggleTheme, theme, children }) {
  const tabs = [
    { key: "upload", label: "Upload" },
    { key: "transcript", label: "Transcript" },
    { key: "quotes", label: "Quotes" },
    { key: "export", label: "Export" },
  ];

  return (
    <div className="app-shell">
      <nav className="navbar" style={navbarStyle}>
        <div style={brandStyle}>QuoteExtractor</div>
        <div style={tabsWrapStyle} role="tablist" aria-label="Main sections">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={current === t.key}
              onClick={() => onNavigate(t.key)}
              style={{
                ...tabStyle,
                ...(current === t.key ? tabActiveStyle : {}),
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={themeButtonStyle}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </nav>
      <main style={mainStyle}>{children}</main>
    </div>
  );
}

// Inline styles keep this self-contained while leveraging existing CSS variables.
const navbarStyle = {
  background: "var(--bg-secondary)",
  borderBottom: `1px solid var(--border-color)`,
  color: "var(--text-primary)",
  padding: "10px 16px",
  display: "flex",
  alignItems: "center",
  gap: 16,
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const brandStyle = {
  fontWeight: 700,
  letterSpacing: 0.3,
};

const tabsWrapStyle = {
  display: "flex",
  gap: 6,
  marginLeft: 8,
  flexWrap: "wrap",
};

const tabStyle = {
  background: "transparent",
  color: "var(--text-primary)",
  border: `1px solid var(--border-color)`,
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const tabActiveStyle = {
  background: "var(--text-secondary)",
  color: "#0b0b0b",
  borderColor: "transparent",
};

const themeButtonStyle = {
  marginLeft: "auto",
};

const mainStyle = {
  padding: "24px 16px",
  maxWidth: 1100,
  margin: "0 auto",
};
