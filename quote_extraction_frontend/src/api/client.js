/**
 * Minimal frontend API client for Quote Extraction Platform.
 * Provides small wrapper methods around fetch for the backend's REST endpoints.
 * - Centralized base URL resolution via config.getApiBaseUrl
 * - Basic error handling: throws Error with status/text and parsed body when available
 * - Mock data fallback when backend is unavailable
 * - Public interface functions are documented and prefixed with PUBLIC_INTERFACE marker
 */

import { getApiBaseUrl, getDefaultHeaders, getMultipartHeaders } from "../config";
import {
  enableMockMode,
  getMockUploadResponse,
  getMockUploadStatus,
  getMockTranscriptList,
  getMockTranscript,
  getMockQuoteList,
  getMockQuote,
  getMockExportJob,
  getMockExportResult,
  isMockMode,
} from "./mockData";

// Internal helper: handle fetch responses consistently
async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const error = new Error(`HTTP ${res.status} ${res.statusText}`);
    error.status = res.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

// Internal helper to build URL with optional query params
function buildUrl(path, query) {
  let base = getApiBaseUrl();
  if (!base && typeof window !== 'undefined') {
    base = window.location.origin;
  }
  base = base || 'http://localhost:3001';
  
  // Ensure base doesn't end with slash and path starts with slash
  base = base.replace(/\/$/, '');
  path = path.startsWith('/') ? path : `/${path}`;
  
  const url = new URL(path, base);
  
  if (query && typeof query === "object") {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    });
  }
  return url.toString();
}

// Internal helper to attempt API call with mock fallback
async function tryWithMock(apiCall, mockData) {
  if (isMockMode()) {
    return typeof mockData === "function" ? mockData() : mockData;
  }
  try {
    return await apiCall();
  } catch (error) {
    if (error.status === 0 || error.status === undefined || error.status === 404) {
      console.warn("API unavailable, falling back to mock data", error);
      enableMockMode();
      return typeof mockData === "function" ? mockData() : mockData;
    }
    throw error;
  }
}

/* ========== Health / Status ========== */

// PUBLIC_INTERFACE
export async function healthCheck() {
  /** GET / - Returns service health status. */
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl("/", null), {
        method: "GET",
        headers: getDefaultHeaders(),
      });
      return handleResponse(res);
    },
    { status: "healthy", mode: "mock" }
  );
}

// PUBLIC_INTERFACE
export async function getServiceStatus() {
  /** GET /api/status - Basic service status and in-memory counts. */
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl("/api/status", null), {
        method: "GET",
        headers: getDefaultHeaders(),
      });
      return handleResponse(res);
    },
    { status: "healthy", mode: "mock", assets: 1, transcripts: 1, quotes: 3 }
  );
}

/* ========== Auth (MVP mock) ========== */

// PUBLIC_INTERFACE
export async function login({ email, password }) {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl("/auth/login", null), {
        method: "POST",
        headers: getDefaultHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
    {
      access_token: "mock_token",
      token_type: "bearer",
      user: { id: "mock_user", email: "demo@example.com", name: "Demo User" },
    }
  );
}

// PUBLIC_INTERFACE
export async function getMe(token) {
  return tryWithMock(
    async () => {
      const headers = getDefaultHeaders();
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(buildUrl("/auth/me", null), {
        method: "GET",
        headers,
      });
      return handleResponse(res);
    },
    { user: { id: "mock_user", email: "demo@example.com", name: "Demo User" } }
  );
}

/* ========== Uploads / Assets ========== */

// PUBLIC_INTERFACE
export async function listAssets() {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl("/api/uploads", null), {
        method: "GET",
        headers: getDefaultHeaders(),
      });
      return handleResponse(res);
    },
    [getMockUploadResponse().asset]
  );
}

// PUBLIC_INTERFACE
export async function uploadAsset(file, { owner_id, token } = {}) {
  return tryWithMock(
    async () => {
      const form = new FormData();
      form.append("file", file);
      if (owner_id) form.append("owner_id", owner_id);

      const headers = getMultipartHeaders(token);
      const res = await fetch(buildUrl("/api/uploads", null), {
        method: "POST",
        headers,
        body: form,
      });
      return handleResponse(res);
    },
    getMockUploadResponse
  );
}

// PUBLIC_INTERFACE
export async function getUploadStatus(asset_id) {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl(`/api/uploads/${encodeURIComponent(asset_id)}/status`, null), {
        method: "GET",
        headers: getDefaultHeaders(),
      });
      return handleResponse(res);
    },
    getMockUploadStatus
  );
}

// PUBLIC_INTERFACE
export async function getAsset(asset_id) {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl(`/api/uploads/${encodeURIComponent(asset_id)}`, null), {
        method: "GET",
        headers: getDefaultHeaders(),
      });
      return handleResponse(res);
    },
    getMockUploadResponse().asset
  );
}

/* ========== Transcripts ========== */

// PUBLIC_INTERFACE
export async function listTranscripts() {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl("/api/transcripts", null), {
        method: "GET",
        headers: getDefaultHeaders(),
      });
      return handleResponse(res);
    },
    getMockTranscriptList
  );
}

// PUBLIC_INTERFACE
export async function createTranscript(payload) {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl("/api/transcripts", null), {
        method: "POST",
        headers: getDefaultHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    { transcript: getMockTranscript() }
  );
}

// PUBLIC_INTERFACE
export async function getTranscript(transcript_id) {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl(`/api/transcripts/${encodeURIComponent(transcript_id)}`, null), {
        method: "GET",
        headers: getDefaultHeaders(),
      });
      return handleResponse(res);
    },
    getMockTranscript
  );
}

// PUBLIC_INTERFACE
export async function updateTranscript(transcript_id, payload) {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl(`/api/transcripts/${encodeURIComponent(transcript_id)}`, null), {
        method: "PUT",
        headers: getDefaultHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    getMockTranscript
  );
}

// PUBLIC_INTERFACE
export async function getTranscriptVersions(transcript_id) {
  return tryWithMock(
    async () => {
      const res = await fetch(
        buildUrl(`/api/transcripts/${encodeURIComponent(transcript_id)}/versions`, null),
        { method: "GET", headers: getDefaultHeaders() }
      );
      return handleResponse(res);
    },
    [{ version: 1, ...getMockTranscript() }]
  );
}

// PUBLIC_INTERFACE
export async function getTranscriptAudit(transcript_id) {
  return tryWithMock(
    async () => {
      const res = await fetch(
        buildUrl(`/api/transcripts/${encodeURIComponent(transcript_id)}/audit`, null),
        { method: "GET", headers: getDefaultHeaders() }
      );
      return handleResponse(res);
    },
    [{ action: "created", timestamp: new Date().toISOString() }]
  );
}

// PUBLIC_INTERFACE
export async function appendTranscriptSegment(transcript_id, payload) {
  return tryWithMock(
    async () => {
      const res = await fetch(
        buildUrl(`/api/transcripts/${encodeURIComponent(transcript_id)}/segments`, null),
        { method: "POST", headers: getDefaultHeaders(), body: JSON.stringify(payload) }
      );
      return handleResponse(res);
    },
    getMockTranscript
  );
}

/* ========== Quotes ========== */

// PUBLIC_INTERFACE
export async function createQuote(payload) {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl("/api/quotes", null), {
        method: "POST",
        headers: getDefaultHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    { quote: getMockQuote() }
  );
}

// PUBLIC_INTERFACE
export async function listQuotes({ assetId, status, minConfidence } = {}) {
  return tryWithMock(
    async () => {
      const res = await fetch(
        buildUrl("/api/quotes", { assetId, status, minConfidence }),
        { method: "GET", headers: getDefaultHeaders() }
      );
      return handleResponse(res);
    },
    getMockQuoteList
  );
}

// PUBLIC_INTERFACE
export async function extractQuotes(payload) {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl("/api/quotes/extract", null), {
        method: "POST",
        headers: getDefaultHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    { items: getMockQuoteList() }
  );
}

// PUBLIC_INTERFACE
export async function getQuote(quote_id) {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl(`/api/quotes/${encodeURIComponent(quote_id)}`, null), {
        method: "GET",
        headers: getDefaultHeaders(),
      });
      return handleResponse(res);
    },
    getMockQuote
  );
}

// PUBLIC_INTERFACE
export async function updateQuote(quote_id, payload) {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl(`/api/quotes/${encodeURIComponent(quote_id)}`, null), {
        method: "PATCH",
        headers: getDefaultHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    () => {
      const mockQuote = getMockQuote(quote_id);
      return { ...mockQuote, ...payload };
    }
  );
}

// PUBLIC_INTERFACE
export async function deleteQuote(quote_id) {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl(`/api/quotes/${encodeURIComponent(quote_id)}`, null), {
        method: "DELETE",
        headers: getDefaultHeaders(),
      });
      if (res.status === 204) return true;
      return handleResponse(res);
    },
    true
  );
}

/* ========== Exports ========== */

// PUBLIC_INTERFACE
export async function listExportJobs() {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl("/api/exports", null), {
        method: "GET",
        headers: getDefaultHeaders(),
      });
      return handleResponse(res);
    },
    [getMockExportJob()]
  );
}

// PUBLIC_INTERFACE
export async function createExportJob(payload) {
  return tryWithMock(
    async () => {
      const res = await fetch(buildUrl("/api/exports", null), {
        method: "POST",
        headers: getDefaultHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    { export: getMockExportJob() }
  );
}

// PUBLIC_INTERFACE
export async function getExportJob(job_id, { download } = {}) {
  return tryWithMock(
    async () => {
      const res = await fetch(
        buildUrl(`/api/exports/${encodeURIComponent(job_id)}`, { download }),
        { method: "GET", headers: getDefaultHeaders() }
      );
      return handleResponse(res);
    },
    download ? getMockExportResult : getMockExportJob
  );
}
