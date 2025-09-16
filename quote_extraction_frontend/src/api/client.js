/**
 * Minimal frontend API client for Quote Extraction Platform.
 * Provides small wrapper methods around fetch for the backend's REST endpoints.
 * - Centralized base URL resolution via config.getApiBaseUrl
 * - Basic error handling: throws Error with status/text and parsed body when available
 * - Public interface functions are documented and prefixed with PUBLIC_INTERFACE marker
 */

import { getApiBaseUrl, getDefaultHeaders, getMultipartHeaders } from "../config";

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
  const base = getApiBaseUrl();
  const url = new URL(path.replace(/^\//, ""), base || window.location.origin);
  if (query && typeof query === "object") {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    });
  }
  return url.toString();
}

/* ========== Health / Status ========== */

// PUBLIC_INTERFACE
export async function healthCheck() {
  /** GET / - Returns service health status. */
  const res = await fetch(buildUrl("/", null), {
    method: "GET",
    headers: getDefaultHeaders(),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getServiceStatus() {
  /** GET /api/status - Basic service status and in-memory counts. */
  const res = await fetch(buildUrl("/api/status", null), {
    method: "GET",
    headers: getDefaultHeaders(),
  });
  return handleResponse(res);
}

/* ========== Auth (MVP mock) ========== */

// PUBLIC_INTERFACE
export async function login({ email, password }) {
  /**
   * POST /auth/login
   * Request: { email, password }
   * Response: { access_token, token_type, user }
   */
  const res = await fetch(buildUrl("/auth/login", null), {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getMe(token) {
  /**
   * GET /auth/me
   * Uses bearer token to retrieve current user.
   */
  const headers = getDefaultHeaders();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(buildUrl("/auth/me", null), {
    method: "GET",
    headers,
  });
  return handleResponse(res);
}

/* ========== Uploads / Assets ========== */

// PUBLIC_INTERFACE
export async function listAssets() {
  /** GET /api/uploads - List all assets. */
  const res = await fetch(buildUrl("/api/uploads", null), {
    method: "GET",
    headers: getDefaultHeaders(),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function uploadAsset(file, { owner_id, token } = {}) {
  /**
   * POST /api/uploads
   * multipart/form-data: file, owner_id?
   * Returns AssetCreateResponse
   */
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
}

// PUBLIC_INTERFACE
export async function getUploadStatus(asset_id) {
  /** GET /api/uploads/{asset_id}/status - Processing status for transcript. */
  const res = await fetch(buildUrl(`/api/uploads/${encodeURIComponent(asset_id)}/status`, null), {
    method: "GET",
    headers: getDefaultHeaders(),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getAsset(asset_id) {
  /** GET /api/uploads/{asset_id} - Fetch a single asset by ID. */
  const res = await fetch(buildUrl(`/api/uploads/${encodeURIComponent(asset_id)}`, null), {
    method: "GET",
    headers: getDefaultHeaders(),
  });
  return handleResponse(res);
}

/* ========== Transcripts ========== */

// PUBLIC_INTERFACE
export async function listTranscripts() {
  /** GET /api/transcripts - List transcripts. */
  const res = await fetch(buildUrl("/api/transcripts", null), {
    method: "GET",
    headers: getDefaultHeaders(),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function createTranscript(payload) {
  /**
   * POST /api/transcripts
   * payload: { asset_id, language?, text? }
   * returns TranscriptResponse
   */
  const res = await fetch(buildUrl("/api/transcripts", null), {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getTranscript(transcript_id) {
  /** GET /api/transcripts/{id} - Fetch transcript by ID. */
  const res = await fetch(buildUrl(`/api/transcripts/${encodeURIComponent(transcript_id)}`, null), {
    method: "GET",
    headers: getDefaultHeaders(),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function updateTranscript(transcript_id, payload) {
  /**
   * PUT /api/transcripts/{id}
   * Replace/edit transcript fields, returns Transcript
   */
  const res = await fetch(buildUrl(`/api/transcripts/${encodeURIComponent(transcript_id)}`, null), {
    method: "PUT",
    headers: getDefaultHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getTranscriptVersions(transcript_id) {
  /** GET /api/transcripts/{id}/versions - Version history. */
  const res = await fetch(
    buildUrl(`/api/transcripts/${encodeURIComponent(transcript_id)}/versions`, null),
    { method: "GET", headers: getDefaultHeaders() }
  );
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getTranscriptAudit(transcript_id) {
  /** GET /api/transcripts/{id}/audit - Audit log. */
  const res = await fetch(
    buildUrl(`/api/transcripts/${encodeURIComponent(transcript_id)}/audit`, null),
    { method: "GET", headers: getDefaultHeaders() }
  );
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function appendTranscriptSegment(transcript_id, payload) {
  /**
   * POST /api/transcripts/{id}/segments
   * payload: { start, end, text, speaker? }
   * returns Transcript
   */
  const res = await fetch(
    buildUrl(`/api/transcripts/${encodeURIComponent(transcript_id)}/segments`, null),
    { method: "POST", headers: getDefaultHeaders(), body: JSON.stringify(payload) }
  );
  return handleResponse(res);
}

/* ========== Quotes ========== */

// PUBLIC_INTERFACE
export async function createQuote(payload) {
  /**
   * POST /api/quotes
   * payload: QuoteCreateRequest
   * returns QuoteResponse
   */
  const res = await fetch(buildUrl("/api/quotes", null), {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function listQuotes({ assetId, status, minConfidence } = {}) {
  /**
   * GET /api/quotes?assetId=&status=&minConfidence=
   * returns list
   */
  const res = await fetch(
    buildUrl("/api/quotes", { assetId, status, minConfidence }),
    { method: "GET", headers: getDefaultHeaders() }
  );
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function extractQuotes(payload) {
  /**
   * POST /api/quotes/extract
   * payload: QuoteExtractRequest
   * returns QuoteExtractResponse
   */
  const res = await fetch(buildUrl("/api/quotes/extract", null), {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getQuote(quote_id) {
  /** GET /api/quotes/{id} - Fetch quote by ID. */
  const res = await fetch(buildUrl(`/api/quotes/${encodeURIComponent(quote_id)}`, null), {
    method: "GET",
    headers: getDefaultHeaders(),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function updateQuote(quote_id, payload) {
  /**
   * PATCH /api/quotes/{id}
   * payload: QuoteUpdateRequest (partial)
   * returns Quote
   */
  const res = await fetch(buildUrl(`/api/quotes/${encodeURIComponent(quote_id)}`, null), {
    method: "PATCH",
    headers: getDefaultHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function deleteQuote(quote_id) {
  /**
   * DELETE /api/quotes/{id}
   * returns 204 No Content
   */
  const res = await fetch(buildUrl(`/api/quotes/${encodeURIComponent(quote_id)}`, null), {
    method: "DELETE",
    headers: getDefaultHeaders(),
  });
  if (res.status === 204) return true;
  return handleResponse(res);
}

/* ========== Exports ========== */

// PUBLIC_INTERFACE
export async function listExportJobs() {
  /** GET /api/exports - List export jobs. */
  const res = await fetch(buildUrl("/api/exports", null), {
    method: "GET",
    headers: getDefaultHeaders(),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function createExportJob(payload) {
  /**
   * POST /api/exports
   * payload: ExportCreateRequest
   * returns 201 ExportResponse
   */
  const res = await fetch(buildUrl("/api/exports", null), {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getExportJob(job_id, { download } = {}) {
  /**
   * GET /api/exports/{job_id}?download=1
   * If download=1 and server returns text, handleResponse will return string.
   */
  const res = await fetch(
    buildUrl(`/api/exports/${encodeURIComponent(job_id)}`, { download }),
    { method: "GET", headers: getDefaultHeaders() }
  );
  return handleResponse(res);
}
