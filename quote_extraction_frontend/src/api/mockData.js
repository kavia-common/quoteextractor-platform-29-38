// Mock data store and utilities for fallback when backend is unavailable

const MOCK_ASSET = {
  id: "mock_asset_1",
  filename: "demo_interview.mp4",
  content_type: "video/mp4",
  asset_type: "video",
  size_bytes: 15728640, // 15MB
  created_at: new Date().toISOString(),
};

const MOCK_TRANSCRIPT = {
  id: "mock_transcript_1",
  asset_id: MOCK_ASSET.id,
  language: "en",
  text: "This is a demo transcript showcasing the platform's capabilities. We can extract meaningful quotes from audio and video content automatically. The AI helps identify key moments and important statements. You can then review, edit, and approve quotes for different platforms.",
  segments: [
    {
      start: 0,
      end: 8,
      text: "This is a demo transcript showcasing the platform's capabilities.",
    },
    {
      start: 8,
      end: 16,
      text: "We can extract meaningful quotes from audio and video content automatically.",
    },
    {
      start: 16,
      end: 24,
      text: "The AI helps identify key moments and important statements.",
    },
    {
      start: 24,
      end: 32,
      text: "You can then review, edit, and approve quotes for different platforms.",
    },
  ],
  status: "completed",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_QUOTES = [
  {
    id: "mock_quote_1",
    transcript_id: MOCK_TRANSCRIPT.id,
    text: "We can extract meaningful quotes from audio and video content automatically.",
    start: 8,
    end: 16,
    confidence: 0.92,
    approved: true,
    tags: ["feature", "automation"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock_quote_2",
    transcript_id: MOCK_TRANSCRIPT.id,
    text: "The AI helps identify key moments and important statements.",
    start: 16,
    end: 24,
    confidence: 0.88,
    approved: true,
    tags: ["ai", "feature"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock_quote_3",
    transcript_id: MOCK_TRANSCRIPT.id,
    text: "You can then review, edit, and approve quotes for different platforms.",
    start: 24,
    end: 32,
    confidence: 0.85,
    approved: false,
    tags: ["workflow"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_EXPORT = {
  id: "mock_export_1",
  quote_ids: ["mock_quote_1", "mock_quote_2"],
  format: "plain_text",
  status: "completed",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock response generators
export function getMockUploadResponse() {
  return {
    asset_id: MOCK_ASSET.id,
    status: "completed",
    asset: MOCK_ASSET,
  };
}

export function getMockUploadStatus() {
  return {
    asset_id: MOCK_ASSET.id,
    status: "completed",
    transcript_id: MOCK_TRANSCRIPT.id,
    updated_at: new Date().toISOString(),
    message: "Processing complete (mock)",
  };
}

export function getMockTranscriptList() {
  return [MOCK_TRANSCRIPT];
}

export function getMockTranscript() {
  return MOCK_TRANSCRIPT;
}

export function getMockQuoteList() {
  return MOCK_QUOTES;
}

export function getMockQuote(id) {
  return MOCK_QUOTES.find((q) => q.id === id) || MOCK_QUOTES[0];
}

export function getMockExportJob() {
  return {
    ...MOCK_EXPORT,
    result_url: null,
  };
}

export function getMockExportResult() {
  const quotes = MOCK_QUOTES.filter((q) => MOCK_EXPORT.quote_ids.includes(q.id));
  return quotes.map((q) => q.text).join("\n\n");
}

// Mock state management
let mockMode = false;
export const isMockMode = () => mockMode;
export const enableMockMode = () => { mockMode = true; };
export const disableMockMode = () => { mockMode = false; };
