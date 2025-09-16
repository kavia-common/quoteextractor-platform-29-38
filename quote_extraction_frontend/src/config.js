//
// Basic configuration for frontend to connect to backend API.
// - Uses environment variable REACT_APP_API_BASE if provided.
// - Falls back to origin-based heuristics or a localhost default.
// - Centralizes header/token handling helpers for the app.
//

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /**
   * Resolve the backend API base URL.
   * Order:
   * 1) REACT_APP_API_BASE (explicit override)
   * 2) If running on localhost: use http://localhost:3001
   * 3) Otherwise, derive from current origin by swapping port 3000 -> 3001 when present
   * 4) Fallback to / (relative) allowing reverse proxy setups
   */
  const envBase = process.env.REACT_APP_API_BASE;
  if (envBase && typeof envBase === "string" && envBase.trim() !== "") {
    return envBase.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    const { origin } = window.location;

    // If running locally on CRA default port, assume backend on 3001
    if (origin.includes("localhost:3000")) {
      return "http://localhost:3001";
    }

    // If a port exists, try swapping 3000->3001
    try {
      const url = new URL(origin);
      if (url.port === "3000") {
        url.port = "3001";
        return url.origin;
      }
      // Otherwise use same origin (assumes reverse proxy)
      return origin;
    } catch {
      // Fallthrough to relative root
    }
  }

  // Final fallback: relative root (e.g., behind same-origin proxy / path)
  return "";
}

// PUBLIC_INTERFACE
export function getDefaultHeaders(token) {
  /** Build default headers for JSON requests, optionally adding auth token. */
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// PUBLIC_INTERFACE
export function getMultipartHeaders(token) {
  /**
   * Headers for multipart uploads.
   * NOTE: Do NOT set Content-Type explicitly; the browser will add the correct boundary.
   */
  const headers = {
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}
