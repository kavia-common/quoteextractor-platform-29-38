import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import UploadPage from "./pages/UploadPage";
import TranscriptPage from "./pages/TranscriptPage";
import QuotesPage from "./pages/QuotesPage";
import ExportPage from "./pages/ExportPage";
import { healthCheck } from "./api/client";

// Wrapper to handle navigation through Layout
function PageWrapper({ children }) {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  const getCurrentSection = () => {
    const path = window.location.pathname;
    if (path.includes("/transcript")) return "transcript";
    if (path.includes("/quotes")) return "quotes";
    if (path.includes("/export")) return "export";
    return "upload";
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Check API health on mount
  useEffect(() => {
    healthCheck().catch(console.warn);
  }, []);

  return (
    <Layout
      current={getCurrentSection()}
      onNavigate={(section) => {
        const paths = {
          upload: "/",
          transcript: "/transcript",
          quotes: "/quotes",
          export: "/export",
        };
        navigate(paths[section] || "/");
      }}
      onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      theme={theme}
    >
      {children}
    </Layout>
  );
}

/**
 * App entry renders the top navigation and page views.
 * Uses React Router for proper navigation and deep linking.
 */
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PageWrapper>
                <UploadPage />
              </PageWrapper>
            }
          />
          <Route
            path="/transcript"
            element={
              <PageWrapper>
                <TranscriptPage />
              </PageWrapper>
            }
          />
          <Route
            path="/quotes"
            element={
              <PageWrapper>
                <QuotesPage />
              </PageWrapper>
            }
          />
          <Route
            path="/export"
            element={
              <PageWrapper>
                <ExportPage />
              </PageWrapper>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
