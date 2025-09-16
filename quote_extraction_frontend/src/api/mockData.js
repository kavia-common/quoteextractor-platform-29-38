// Mock data store and utilities for fallback when backend is unavailable

const MOCK_ASSET = {
  id: "mock_asset_1",
  filename: "startup_founder_interview.mp4",
  content_type: "video/mp4",
  asset_type: "video",
  size_bytes: 47185920, // 45MB
  created_at: new Date().toISOString(),
};

const MOCK_TRANSCRIPT = {
  id: "mock_transcript_1",
  asset_id: MOCK_ASSET.id,
  language: "en",
  text: `Welcome to Tech Founder Stories. I'm Sarah Chen, and today I'm joined by Marcus Rodriguez, the co-founder and CEO of DataFlow, a company that's revolutionizing how businesses handle real-time analytics. Marcus, thanks for being here.

Thanks for having me, Sarah. It's great to be on the show.

So let's start at the beginning. What was the moment when you realized there was a real problem that needed solving in the analytics space?

You know, it's funny... I was actually working at a fintech startup about four years ago, and we were constantly struggling with our data pipeline. We'd spend more time debugging our analytics than actually using them to make decisions. I remember one particularly frustrating week where our reporting system went down three times, and each time it took our engineering team hours to figure out what went wrong.

That sounds incredibly frustrating. How did that experience shape your vision for DataFlow?

Well, it made me realize that most companies are dealing with this same problem, but they're all building these complex, fragile systems from scratch. There had to be a better way – a way to make real-time data processing as simple as setting up a website. That's when my co-founder Elena and I started sketching out what would eventually become DataFlow.

And Elena brings a really interesting background to this, doesn't she?

Absolutely. Elena has this incredible combination of PhD-level machine learning expertise and years of experience scaling infrastructure at Google. She's the kind of person who can optimize a neural network in the morning and design a distributed system architecture in the afternoon. Without her technical vision, DataFlow simply wouldn't exist.

That's a powerful combination. Now, I know you've raised significant funding recently. Can you tell us about that journey?

The fundraising process was... intense. We went through about six months of pitches, due diligence, and negotiations. What really helped us was that we had already built a working product and had paying customers. VCs love to see traction, and we could show them real revenue growth – we went from zero to $2.3 million ARR in just eighteen months.

That's impressive growth. What do you think was the key to achieving that kind of traction so quickly?

I think it comes down to product-market fit. We didn't try to build everything for everyone. Instead, we focused obsessively on solving one specific problem really, really well: making real-time analytics accessible to companies that don't have massive engineering teams. Every feature we built, every decision we made, was guided by that north star.

Speaking of features, what's on the roadmap for DataFlow? What are you most excited about?

Oh, there's so much coming. We're working on this AI-powered anomaly detection system that can automatically identify unusual patterns in your data streams. Imagine getting a Slack notification the moment something unexpected happens in your business metrics, without having to set up complex rules or thresholds.

That sounds like it could be a game-changer for a lot of businesses. Now, I have to ask about the competitive landscape. There are some big players in this space – how do you compete with companies that have much larger engineering teams and marketing budgets?

You're right, the competition is fierce. But I've learned that being smaller can actually be an advantage. We can move faster, we can be more responsive to customer feedback, and we can take risks that larger companies wouldn't take. When a customer asks for a feature, we can have it built and deployed in weeks, not months.

That agility is definitely valuable. What advice would you give to other founders who are trying to build in a crowded market?

Focus on your customers, not your competitors. I see too many founders who spend all their time analyzing what their competitors are doing instead of talking to their users. Your customers will tell you exactly what to build next – you just have to listen. And don't be afraid to say no to features that don't align with your core vision.

That's excellent advice. Before we wrap up, what's your long-term vision for DataFlow? Where do you see the company in five years?

I want DataFlow to be the infrastructure that powers the next generation of data-driven businesses. In five years, I hope that setting up real-time analytics will be as easy as creating a Shopify store or launching a WordPress site. We want to democratize access to sophisticated data tools so that every company, regardless of size, can make decisions based on real-time insights.

That's an inspiring vision. Marcus, thank you so much for sharing your story with us today.

Thank you, Sarah. This was fantastic.`,
  segments: [
    {
      start: 0,
      end: 12.5,
      speaker: "Sarah Chen",
      text: "Welcome to Tech Founder Stories. I'm Sarah Chen, and today I'm joined by Marcus Rodriguez, the co-founder and CEO of DataFlow, a company that's revolutionizing how businesses handle real-time analytics. Marcus, thanks for being here."
    },
    {
      start: 13.2,
      end: 17.8,
      speaker: "Marcus Rodriguez",
      text: "Thanks for having me, Sarah. It's great to be on the show."
    },
    {
      start: 18.5,
      end: 25.3,
      speaker: "Sarah Chen",
      text: "So let's start at the beginning. What was the moment when you realized there was a real problem that needed solving in the analytics space?"
    },
    {
      start: 26.1,
      end: 51.7,
      speaker: "Marcus Rodriguez",
      text: "You know, it's funny... I was actually working at a fintech startup about four years ago, and we were constantly struggling with our data pipeline. We'd spend more time debugging our analytics than actually using them to make decisions. I remember one particularly frustrating week where our reporting system went down three times, and each time it took our engineering team hours to figure out what went wrong."
    },
    {
      start: 52.4,
      end: 58.9,
      speaker: "Sarah Chen",
      text: "That sounds incredibly frustrating. How did that experience shape your vision for DataFlow?"
    },
    {
      start: 59.8,
      end: 78.2,
      speaker: "Marcus Rodriguez",
      text: "Well, it made me realize that most companies are dealing with this same problem, but they're all building these complex, fragile systems from scratch. There had to be a better way – a way to make real-time data processing as simple as setting up a website. That's when my co-founder Elena and I started sketching out what would eventually become DataFlow."
    },
    {
      start: 79.1,
      end: 84.6,
      speaker: "Sarah Chen",
      text: "And Elena brings a really interesting background to this, doesn't she?"
    },
    {
      start: 85.3,
      end: 103.8,
      speaker: "Marcus Rodriguez",
      text: "Absolutely. Elena has this incredible combination of PhD-level machine learning expertise and years of experience scaling infrastructure at Google. She's the kind of person who can optimize a neural network in the morning and design a distributed system architecture in the afternoon. Without her technical vision, DataFlow simply wouldn't exist."
    },
    {
      start: 104.7,
      end: 112.4,
      speaker: "Sarah Chen",
      text: "That's a powerful combination. Now, I know you've raised significant funding recently. Can you tell us about that journey?"
    },
    {
      start: 113.2,
      end: 134.9,
      speaker: "Marcus Rodriguez",
      text: "The fundraising process was... intense. We went through about six months of pitches, due diligence, and negotiations. What really helped us was that we had already built a working product and had paying customers. VCs love to see traction, and we could show them real revenue growth – we went from zero to $2.3 million ARR in just eighteen months."
    },
    {
      start: 135.8,
      end: 142.1,
      speaker: "Sarah Chen",
      text: "That's impressive growth. What do you think was the key to achieving that kind of traction so quickly?"
    },
    {
      start: 143.0,
      end: 162.5,
      speaker: "Marcus Rodriguez",
      text: "I think it comes down to product-market fit. We didn't try to build everything for everyone. Instead, we focused obsessively on solving one specific problem really, really well: making real-time analytics accessible to companies that don't have massive engineering teams. Every feature we built, every decision we made, was guided by that north star."
    },
    {
      start: 163.4,
      end: 170.2,
      speaker: "Sarah Chen",
      text: "Speaking of features, what's on the roadmap for DataFlow? What are you most excited about?"
    },
    {
      start: 171.1,
      end: 187.8,
      speaker: "Marcus Rodriguez",
      text: "Oh, there's so much coming. We're working on this AI-powered anomaly detection system that can automatically identify unusual patterns in your data streams. Imagine getting a Slack notification the moment something unexpected happens in your business metrics, without having to set up complex rules or thresholds."
    },
    {
      start: 188.7,
      end: 200.3,
      speaker: "Sarah Chen",
      text: "That sounds like it could be a game-changer for a lot of businesses. Now, I have to ask about the competitive landscape. There are some big players in this space – how do you compete with companies that have much larger engineering teams and marketing budgets?"
    },
    {
      start: 201.2,
      end: 220.6,
      speaker: "Marcus Rodriguez",
      text: "You're right, the competition is fierce. But I've learned that being smaller can actually be an advantage. We can move faster, we can be more responsive to customer feedback, and we can take risks that larger companies wouldn't take. When a customer asks for a feature, we can have it built and deployed in weeks, not months."
    },
    {
      start: 221.5,
      end: 229.8,
      speaker: "Sarah Chen",
      text: "That agility is definitely valuable. What advice would you give to other founders who are trying to build in a crowded market?"
    },
    {
      start: 230.7,
      end: 248.9,
      speaker: "Marcus Rodriguez",
      text: "Focus on your customers, not your competitors. I see too many founders who spend all their time analyzing what their competitors are doing instead of talking to their users. Your customers will tell you exactly what to build next – you just have to listen. And don't be afraid to say no to features that don't align with your core vision."
    },
    {
      start: 249.8,
      end: 257.4,
      speaker: "Sarah Chen",
      text: "That's excellent advice. Before we wrap up, what's your long-term vision for DataFlow? Where do you see the company in five years?"
    },
    {
      start: 258.3,
      end: 277.1,
      speaker: "Marcus Rodriguez",
      text: "I want DataFlow to be the infrastructure that powers the next generation of data-driven businesses. In five years, I hope that setting up real-time analytics will be as easy as creating a Shopify store or launching a WordPress site. We want to democratize access to sophisticated data tools so that every company, regardless of size, can make decisions based on real-time insights."
    },
    {
      start: 278.0,
      end: 283.7,
      speaker: "Sarah Chen",
      text: "That's an inspiring vision. Marcus, thank you so much for sharing your story with us today."
    },
    {
      start: 284.6,
      end: 287.9,
      speaker: "Marcus Rodriguez",
      text: "Thank you, Sarah. This was fantastic."
    }
  ],
  status: "completed",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_QUOTES = [
  {
    id: "mock_quote_1",
    transcript_id: MOCK_TRANSCRIPT.id,
    text: "We'd spend more time debugging our analytics than actually using them to make decisions.",
    start: 26.1,
    end: 51.7,
    confidence: 0.94,
    approved: true,
    tags: ["problem", "analytics", "pain-point"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock_quote_2",
    transcript_id: MOCK_TRANSCRIPT.id,
    text: "There had to be a better way – a way to make real-time data processing as simple as setting up a website.",
    start: 59.8,
    end: 78.2,
    confidence: 0.91,
    approved: true,
    tags: ["vision", "simplicity", "solution"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock_quote_3",
    transcript_id: MOCK_TRANSCRIPT.id,
    text: "She's the kind of person who can optimize a neural network in the morning and design a distributed system architecture in the afternoon.",
    start: 85.3,
    end: 103.8,
    confidence: 0.88,
    approved: false,
    tags: ["team", "expertise", "technical"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock_quote_4",
    transcript_id: MOCK_TRANSCRIPT.id,
    text: "We went from zero to $2.3 million ARR in just eighteen months.",
    start: 113.2,
    end: 134.9,
    confidence: 0.96,
    approved: true,
    tags: ["growth", "metrics", "success"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock_quote_5",
    transcript_id: MOCK_TRANSCRIPT.id,
    text: "We focused obsessively on solving one specific problem really, really well: making real-time analytics accessible to companies that don't have massive engineering teams.",
    start: 143.0,
    end: 162.5,
    confidence: 0.93,
    approved: true,
    tags: ["focus", "product-market-fit", "strategy"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock_quote_6",
    transcript_id: MOCK_TRANSCRIPT.id,
    text: "Imagine getting a Slack notification the moment something unexpected happens in your business metrics, without having to set up complex rules or thresholds.",
    start: 171.1,
    end: 187.8,
    confidence: 0.87,
    approved: false,
    tags: ["ai", "automation", "feature"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock_quote_7",
    transcript_id: MOCK_TRANSCRIPT.id,
    text: "Being smaller can actually be an advantage. We can move faster, we can be more responsive to customer feedback, and we can take risks that larger companies wouldn't take.",
    start: 201.2,
    end: 220.6,
    confidence: 0.90,
    approved: true,
    tags: ["startup", "agility", "competition"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock_quote_8",
    transcript_id: MOCK_TRANSCRIPT.id,
    text: "Focus on your customers, not your competitors. Your customers will tell you exactly what to build next – you just have to listen.",
    start: 230.7,
    end: 248.9,
    confidence: 0.95,
    approved: true,
    tags: ["advice", "customer-focus", "product"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock_quote_9",
    transcript_id: MOCK_TRANSCRIPT.id,
    text: "We want to democratize access to sophisticated data tools so that every company, regardless of size, can make decisions based on real-time insights.",
    start: 258.3,
    end: 277.1,
    confidence: 0.92,
    approved: false,
    tags: ["vision", "democratization", "mission"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const MOCK_EXPORT = {
  id: "mock_export_1",
  quote_ids: ["mock_quote_1", "mock_quote_2", "mock_quote_4", "mock_quote_5", "mock_quote_7", "mock_quote_8"],
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
