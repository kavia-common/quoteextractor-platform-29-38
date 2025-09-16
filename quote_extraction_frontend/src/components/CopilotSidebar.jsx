import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * CopilotSidebar
 * An interactive help/chat assistant sidebar tailored to the quote extraction platform.
 * Provides contextual help, workflow tips, and navigation suggestions.
 * 
 * Props:
 * - isOpen: boolean - whether the sidebar is open
 * - onClose: function - handler to close the sidebar
 */

// PUBLIC_INTERFACE
export default function CopilotSidebar({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("help");
  const [expandedSection, setExpandedSection] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current page context
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes("/transcript")) return "transcript";
    if (path.includes("/quotes")) return "quotes";
    if (path.includes("/export")) return "export";
    return "upload";
  };

  const currentPage = getCurrentPage();

  // Handle navigation suggestions
  const handleNavigate = (path) => {
    navigate(path);
    // Optionally close sidebar after navigation
    // onClose();
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div style={backdropStyle} onClick={onClose} />
      
      {/* Sidebar */}
      <div style={sidebarStyle} className="copilot-sidebar">
        {/* Header */}
        <div style={headerStyle}>
          <div style={headerTitleStyle}>
            <span style={robotIconStyle}>🤖</span>
            <div>
              <div style={titleStyle}>QuoteBot Assistant</div>
              <div style={subtitleStyle}>Your quote extraction guide</div>
            </div>
          </div>
          <button onClick={onClose} style={closeButtonStyle} title="Close">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={tabsStyle}>
          <button
            onClick={() => setActiveTab("help")}
            style={{ ...tabStyle, ...(activeTab === "help" ? tabActiveStyle : {}) }}
          >
            💡 Help
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            style={{ ...tabStyle, ...(activeTab === "tips" ? tabActiveStyle : {}) }}
          >
            ⭐ Tips
          </button>
          <button
            onClick={() => setActiveTab("nav")}
            style={{ ...tabStyle, ...(activeTab === "nav" ? tabActiveStyle : {}) }}
          >
            🧭 Navigate
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {activeTab === "help" && (
            <HelpContent 
              currentPage={currentPage}
              expandedSection={expandedSection}
              toggleSection={toggleSection}
            />
          )}
          {activeTab === "tips" && (
            <TipsContent currentPage={currentPage} />
          )}
          {activeTab === "nav" && (
            <NavigationContent 
              currentPage={currentPage}
              onNavigate={handleNavigate}
            />
          )}
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <div style={footerTextStyle}>
            Need more help? Check our documentation or contact support.
          </div>
        </div>
      </div>
    </>
  );
}

// Help Content Component
function HelpContent({ currentPage, expandedSection, toggleSection }) {
  const helpSections = {
    upload: [
      {
        id: "upload-basics",
        title: "📤 Uploading Files",
        content: [
          "• Drag & drop audio/video files or click to browse",
          "• Supported formats: MP4, MP3, WAV, MOV, and more",
          "• Keep files under 500MB for best performance",
          "• Processing starts automatically after upload"
        ]
      },
      {
        id: "upload-troubleshooting",
        title: "🔧 Troubleshooting",
        content: [
          "• File not uploading? Check your internet connection",
          "• Unsupported format? Try converting to MP4 or MP3",
          "• Large files may take several minutes to process",
          "• Refresh the page if status seems stuck"
        ]
      }
    ],
    transcript: [
      {
        id: "transcript-editing",
        title: "✏️ Editing Transcripts",
        content: [
          "• Click in the text area to edit transcript content",
          "• Use Ctrl/Cmd+S to save changes quickly",
          "• Select text and click 'Add as Segment' to organize content",
          "• Segments help with better quote extraction"
        ]
      },
      {
        id: "transcript-workflow",
        title: "🔄 Workflow Tips",
        content: [
          "• Review transcript accuracy before extracting quotes",
          "• Fix speaker names and timing if needed",
          "• Use the 'Extract Quotes' button when ready",
          "• Extracted quotes will appear in the Quotes tab"
        ]
      }
    ],
    quotes: [
      {
        id: "quote-management",
        title: "📝 Managing Quotes",
        content: [
          "• Review AI-extracted quotes for accuracy",
          "• Approve good quotes with the green checkmark",
          "• Reject poor quotes with the red X",
          "• Use filters to find quotes by confidence or tags"
        ]
      },
      {
        id: "quote-organization",
        title: "🏷️ Organization",
        content: [
          "• Add tags like 'product', 'vision', 'funny' to organize",
          "• Use confidence filter to focus on high-quality quotes",
          "• Only approved quotes can be exported",
          "• Edit quote text if minor corrections are needed"
        ]
      }
    ],
    export: [
      {
        id: "export-formats",
        title: "📋 Export Formats",
        content: [
          "• Plain Text: Simple list for articles/blogs",
          "• JSON: Structured data for developers",
          "• Social: Twitter, LinkedIn, Instagram optimized",
          "• Captions: SRT/VTT for video subtitles"
        ]
      },
      {
        id: "export-tips",
        title: "💡 Export Best Practices",
        content: [
          "• Select only your best approved quotes",
          "• Add title and author for professional formatting",
          "• Preview before downloading",
          "• Use social formats for optimal engagement"
        ]
      }
    ]
  };

  const sections = helpSections[currentPage] || [];

  return (
    <div style={helpContentStyle}>
      <div style={currentPageBadgeStyle}>
        Currently on: <strong>{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</strong>
      </div>
      
      {sections.map((section) => (
        <div key={section.id} style={sectionStyle}>
          <button
            onClick={() => toggleSection(section.id)}
            style={sectionHeaderStyle}
          >
            <span>{section.title}</span>
            <span style={expandIconStyle}>
              {expandedSection === section.id ? "−" : "+"}
            </span>
          </button>
          {expandedSection === section.id && (
            <div style={sectionContentStyle}>
              {section.content.map((item, index) => (
                <div key={index} style={listItemStyle}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Tips Content Component
function TipsContent({ currentPage }) {
  const allTips = {
    upload: [
      "🎯 For best results, upload clear audio with minimal background noise",
      "⚡ Shorter files (under 30 minutes) process faster",
      "🎙️ Podcasts and interviews work great for quote extraction",
      "📱 Mobile recordings work too - just ensure good audio quality"
    ],
    transcript: [
      "🔍 Review speaker names - they help with quote attribution",
      "✂️ Break long paragraphs into segments for better organization",
      "🎯 Focus on accuracy over perfection - minor typos are ok",
      "⏰ Timing doesn't need to be perfect for most use cases"
    ],
    quotes: [
      "💎 Look for quotes that are self-contained and impactful",
      "🏷️ Tag quotes by theme: 'inspiration', 'strategy', 'humor', etc.",
      "📊 Higher confidence scores usually mean better AI extraction",
      "✨ Aim for quotes between 10-280 characters for social media"
    ],
    export: [
      "📱 Twitter format automatically handles character limits",
      "💼 LinkedIn format includes professional attribution",
      "📄 Use plain text for blog posts and articles",
      "🎬 SRT/VTT formats are perfect for video captions"
    ]
  };

  const tips = allTips[currentPage] || [];

  return (
    <div style={tipsContentStyle}>
      <div style={tipsHeaderStyle}>
        💡 Pro Tips for {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
      </div>
      {tips.map((tip, index) => (
        <div key={index} style={tipItemStyle}>
          {tip}
        </div>
      ))}
    </div>
  );
}

// Navigation Content Component
function NavigationContent({ currentPage, onNavigate }) {
  const navItems = [
    {
      key: "upload",
      label: "Upload",
      icon: "📤",
      description: "Upload new audio/video files",
      current: currentPage === "upload"
    },
    {
      key: "transcript",
      label: "Transcript",
      icon: "📝",
      description: "Review and edit transcripts",
      current: currentPage === "transcript"
    },
    {
      key: "quotes", 
      label: "Quotes",
      icon: "💬",
      description: "Manage and approve quotes",
      current: currentPage === "quotes"
    },
    {
      key: "export",
      label: "Export",
      icon: "📋",
      description: "Generate formatted exports",
      current: currentPage === "export"
    }
  ];

  const getNextStep = () => {
    const steps = ["upload", "transcript", "quotes", "export"];
    const currentIndex = steps.indexOf(currentPage);
    if (currentIndex < steps.length - 1) {
      return steps[currentIndex + 1];
    }
    return null;
  };

  const nextStep = getNextStep();

  return (
    <div style={navContentStyle}>
      <div style={workflowHeaderStyle}>
        🧭 Platform Navigation
      </div>
      
      {nextStep && (
        <div style={nextStepStyle}>
          <div style={nextStepLabelStyle}>Suggested next step:</div>
          <button
            onClick={() => onNavigate(`/${nextStep === "upload" ? "" : nextStep}`)}
            style={nextStepButtonStyle}
          >
            {navItems.find(item => item.key === nextStep)?.icon} Go to {nextStep.charAt(0).toUpperCase() + nextStep.slice(1)}
          </button>
        </div>
      )}

      <div style={navListStyle}>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key === "upload" ? "/" : `/${item.key}`)}
            style={{
              ...navItemStyle,
              ...(item.current ? navItemCurrentStyle : {})
            }}
            disabled={item.current}
          >
            <div style={navItemIconStyle}>{item.icon}</div>
            <div style={navItemContentStyle}>
              <div style={navItemLabelStyle}>{item.label}</div>
              <div style={navItemDescStyle}>{item.description}</div>
            </div>
            {item.current && <div style={currentBadgeStyle}>Current</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

// Styles
const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  zIndex: 999,
  backdropFilter: "blur(2px)",
};

const sidebarStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "400px",
  height: "100vh",
  backgroundColor: "var(--bg-secondary)",
  border: "1px solid var(--border-color)",
  borderRight: "none",
  display: "flex",
  flexDirection: "column",
  zIndex: 1000,
  boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.15)",
  animation: "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

const headerStyle = {
  padding: "20px",
  borderBottom: "1px solid var(--border-color)",
  background: "linear-gradient(135deg, rgba(97,218,251,0.1), rgba(34,197,94,0.1))",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const headerTitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const robotIconStyle = {
  fontSize: "32px",
};

const titleStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "var(--text-primary)",
  lineHeight: "1.2",
};

const subtitleStyle = {
  fontSize: "12px",
  color: "var(--text-secondary)",
  opacity: 0.8,
};

const closeButtonStyle = {
  background: "transparent",
  border: "1px solid var(--border-color)",
  color: "var(--text-primary)",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "bold",
};

const tabsStyle = {
  display: "flex",
  borderBottom: "1px solid var(--border-color)",
  background: "var(--bg-primary)",
};

const tabStyle = {
  flex: 1,
  padding: "12px 8px",
  background: "transparent",
  border: "none",
  color: "var(--text-primary)",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  opacity: 0.7,
  transition: "all 0.2s ease",
};

const tabActiveStyle = {
  opacity: 1,
  backgroundColor: "var(--bg-secondary)",
  borderBottom: "2px solid var(--text-secondary)",
};

const contentStyle = {
  flex: 1,
  overflow: "auto",
  padding: "16px",
};

const footerStyle = {
  padding: "16px",
  borderTop: "1px solid var(--border-color)",
  background: "var(--bg-primary)",
};

const footerTextStyle = {
  fontSize: "11px",
  opacity: 0.7,
  textAlign: "center",
  color: "var(--text-primary)",
};

// Help Content Styles
const helpContentStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const currentPageBadgeStyle = {
  padding: "8px 12px",
  backgroundColor: "rgba(97,218,251,0.1)",
  border: "1px solid rgba(97,218,251,0.3)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--text-primary)",
};

const sectionStyle = {
  border: "1px solid var(--border-color)",
  borderRadius: "8px",
  overflow: "hidden",
};

const sectionHeaderStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "var(--bg-primary)",
  border: "none",
  color: "var(--text-primary)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "13px",
  fontWeight: "600",
  textAlign: "left",
};

const expandIconStyle = {
  fontSize: "16px",
  fontWeight: "bold",
};

const sectionContentStyle = {
  padding: "12px 16px",
  background: "rgba(255,255,255,0.02)",
  borderTop: "1px solid var(--border-color)",
};

const listItemStyle = {
  fontSize: "12px",
  lineHeight: "1.5",
  color: "var(--text-primary)",
  marginBottom: "6px",
};

// Tips Content Styles
const tipsContentStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const tipsHeaderStyle = {
  fontSize: "14px",
  fontWeight: "700",
  color: "var(--text-primary)",
  marginBottom: "8px",
};

const tipItemStyle = {
  padding: "12px",
  background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.04))",
  border: "1px solid var(--border-color)",
  borderRadius: "8px",
  fontSize: "12px",
  lineHeight: "1.4",
  color: "var(--text-primary)",
};

// Navigation Content Styles
const navContentStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const workflowHeaderStyle = {
  fontSize: "14px",
  fontWeight: "700",
  color: "var(--text-primary)",
};

const nextStepStyle = {
  padding: "12px",
  background: "rgba(34,197,94,0.1)",
  border: "1px solid rgba(34,197,94,0.3)",
  borderRadius: "8px",
};

const nextStepLabelStyle = {
  fontSize: "11px",
  opacity: 0.8,
  marginBottom: "6px",
  color: "var(--text-primary)",
};

const nextStepButtonStyle = {
  width: "100%",
  padding: "8px 12px",
  background: "linear-gradient(90deg, rgba(97,218,251,0.9), rgba(34,197,94,0.9))",
  color: "#0b0b0b",
  border: "none",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "700",
  cursor: "pointer",
};

const navListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const navItemStyle = {
  width: "100%",
  padding: "12px",
  background: "var(--bg-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  textAlign: "left",
  transition: "all 0.2s ease",
};

const navItemCurrentStyle = {
  background: "rgba(97,218,251,0.1)",
  border: "1px solid rgba(97,218,251,0.3)",
  cursor: "not-allowed",
};

const navItemIconStyle = {
  fontSize: "20px",
};

const navItemContentStyle = {
  flex: 1,
};

const navItemLabelStyle = {
  fontSize: "13px",
  fontWeight: "600",
  color: "var(--text-primary)",
  lineHeight: "1.2",
};

const navItemDescStyle = {
  fontSize: "11px",
  opacity: 0.7,
  color: "var(--text-primary)",
  marginTop: "2px",
};

const currentBadgeStyle = {
  fontSize: "10px",
  padding: "2px 6px",
  background: "rgba(97,218,251,0.8)",
  color: "#0b0b0b",
  borderRadius: "4px",
  fontWeight: "600",
};

// Inject slide-in animation
if (typeof document !== "undefined") {
  const existingStyle = document.querySelector("#copilot-sidebar-styles");
  if (!existingStyle) {
    const styleTag = document.createElement("style");
    styleTag.id = "copilot-sidebar-styles";
    styleTag.innerHTML = `
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .copilot-sidebar {
    width: 100% !important;
    left: 0 !important;
  }
}

.copilot-sidebar::-webkit-scrollbar {
  width: 6px;
}

.copilot-sidebar::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

.copilot-sidebar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}
`;
    document.head.appendChild(styleTag);
  }
}
