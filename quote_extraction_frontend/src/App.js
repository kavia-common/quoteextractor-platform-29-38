import React, { useEffect, useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import UploadPage from "./pages/UploadPage";
import TranscriptPage from "./pages/TranscriptPage";
import QuotesPage from "./pages/QuotesPage";
import ExportPage from "./pages/ExportPage";

/**
 * App entry renders the top navigation and page views.
 * Minimal local routing implemented with state to keep template light-weight.
 */
function App() {
  const [theme, setTheme] = useState("light");
  const [section, setSection] = useState("upload");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const renderPage = () => {
    switch (section) {
      case "upload":
        return <UploadPage />;
      case "transcript":
        return <TranscriptPage />;
      case "quotes":
        return <QuotesPage />;
      case "export":
        return <ExportPage />;
      default:
        return <UploadPage />;
    }
  };

  return (
    <div className="App">
      <Layout
        current={section}
        onNavigate={setSection}
        onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        theme={theme}
      >
        {renderPage()}
      </Layout>
    </div>
  );
}

export default App;
