import React from "react";

/**
 * CopilotButton
 * A floating action button for the Copilot assistant feature.
 * Appears in the bottom-right corner with an elegant design.
 * 
 * Props:
 * - onClick: function - handler for when the button is clicked
 * - isOpen: boolean - whether the copilot sidebar is currently open
 */

// PUBLIC_INTERFACE
export default function CopilotButton({ onClick, isOpen = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...buttonStyle,
        ...(isOpen ? buttonActiveStyle : {}),
      }}
      title={isOpen ? "Close Copilot" : "Open Copilot Assistant"}
      aria-label={isOpen ? "Close Copilot" : "Open Copilot Assistant"}
      className="copilot-button"
    >
      <div style={iconWrapper}>
        {isOpen ? (
          <span style={iconStyle}>✕</span>
        ) : (
          <span style={iconStyle}>🤖</span>
        )}
      </div>
      {!isOpen && (
        <div style={pulseStyle} className="copilot-pulse" />
      )}
    </button>
  );
}

const buttonStyle = {
  position: "fixed",
  bottom: "24px",
  right: "24px",
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(97,218,251,0.9), rgba(34,197,94,0.9))",
  border: "2px solid rgba(255,255,255,0.1)",
  color: "#0b0b0b",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 24px rgba(0,0,0,0.2), 0 4px 8px rgba(97,218,251,0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  zIndex: 1000,
  backdropFilter: "blur(8px)",
  overflow: "hidden",
};

const buttonActiveStyle = {
  background: "linear-gradient(135deg, rgba(239,68,68,0.9), rgba(245,101,101,0.9))",
  transform: "scale(1.05)",
  boxShadow: "0 12px 32px rgba(0,0,0,0.25), 0 6px 12px rgba(239,68,68,0.4)",
};

const iconWrapper = {
  position: "relative",
  zIndex: 2,
};

const iconStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  display: "block",
  lineHeight: 1,
};

const pulseStyle = {
  position: "absolute",
  top: "-2px",
  left: "-2px",
  right: "-2px",
  bottom: "-2px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(97,218,251,0.4), rgba(34,197,94,0.4))",
  animation: "copilot-pulse 2s infinite",
  zIndex: 1,
};

// Inject keyframes for the pulse animation
if (typeof document !== "undefined") {
  const existingStyle = document.querySelector("#copilot-button-styles");
  if (!existingStyle) {
    const styleTag = document.createElement("style");
    styleTag.id = "copilot-button-styles";
    styleTag.innerHTML = `
@keyframes copilot-pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.copilot-button:hover {
  transform: translateY(-2px) scale(1.02);
}

.copilot-button:active {
  transform: translateY(0) scale(0.98);
}

@media (max-width: 768px) {
  .copilot-button {
    width: 48px !important;
    height: 48px !important;
    bottom: 16px !important;
    right: 16px !important;
  }
  
  .copilot-button .copilot-pulse {
    top: -1px !important;
    left: -1px !important;
    right: -1px !important;
    bottom: -1px !important;
  }
}
`;
    document.head.appendChild(styleTag);
  }
}
