export type Project = {
  slug: string;
  name: string;
  oneLiner: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
  status: "active" | "shipped" | "archived";
  featured?: boolean;
  impact?: string;
  caseStudy: {
    problem: string;
    approach: string;
    stack: string[];
    keyDecisions: string[];
    outcome: string;
  };
};

export type Hackathon = {
  event: string;
  project: string;
  description: string;
  team?: string;
  result: string;
  year: number;
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  body: string[];
};

export const projects: Project[] = [
  {
    slug: "arch-srm",
    name: "Arch SRM",
    oneLiner: "A student-first portal that replaced a broken official workflow.",
    description:
      "A PWA for SRMIST students replacing the broken official portal. Attendance tracking, timetable, marks with grade boundary projections, mess schedule, and academic calendar. Runs entirely on Cloudflare Workers + Hono + KV with zero cold starts.",
    tags: ["Next.js", "Cloudflare Workers", "Hono", "KV", "PWA"],
    github: "https://github.com/aryan-astra/arch-srm",
    live: "https://arch-srm.pages.dev",
    status: "active",
    featured: true,
    impact: "300+ daily active users at SRMIST.",
    caseStudy: {
      problem:
        "Students were juggling multiple unstable portals for attendance, timetable, marks, and mess info. The official experience was slow, inconsistent, and difficult to use on mobile.",
      approach:
        "I built one fast PWA with predictable information architecture, aggressive caching, and a low-latency API on Cloudflare Workers. The UI focused on high-frequency student actions first.",
      stack: ["Next.js", "Cloudflare Workers", "Hono", "Cloudflare KV", "PWA"],
      keyDecisions: [
        "Optimized for repeat student tasks instead of feature parity with legacy portals.",
        "Chose edge runtime and KV reads to keep interactions quick during peak academic hours.",
        "Used conservative UI patterns and clear state messaging to minimize confusion.",
      ],
      outcome:
        "Adopted by 300+ daily users and became the default utility app for many SRMIST students.",
    },
  },
  {
    slug: "voco",
    name: "VOCO",
    oneLiner: "An offline automation agent that runs without cloud dependencies.",
    description:
      "An offline Windows OS automation agent powered by a local LLM (Qwen3). No cloud dependency, no API calls. Controls the browser via Playwright and the OS via pyautogui. Designed for the IIMA Ventures AI Summer Residency.",
    tags: ["Python", "Qwen3", "Playwright", "pyautogui", "LLM"],
    github: "https://github.com/aryan-astra/voco",
    status: "active",
    featured: true,
    impact: "Fully offline AI agent — no API keys needed.",
    caseStudy: {
      problem:
        "Most assistant workflows assume cloud APIs and stable internet. I wanted a private, local-first agent that still performs practical automation.",
      approach:
        "VOCO coordinates a local Qwen3 model with browser and desktop automation layers. Prompting, execution, and state all remain on-device.",
      stack: ["Python", "Qwen3", "Playwright", "pyautogui"],
      keyDecisions: [
        "Prioritized reliability of command execution over broad feature scope.",
        "Designed explicit action boundaries to reduce destructive automation mistakes.",
        "Kept architecture local-first to avoid API lock-in.",
      ],
      outcome:
        "Produced a robust demo of private local AI automation suitable for constrained environments.",
    },
  },
  {
    slug: "maxq",
    name: "MaxQ",
    oneLiner: "An Android player with shader-native reactive visuals.",
    description:
      "An Android music player with a pure AGSL Liquid Glass shader visualizer — no image processing libraries, geometry computed directly in shader code. Supabase auth and analytics pipeline in progress.",
    tags: ["Kotlin", "Android", "AGSL", "Supabase"],
    github: "https://github.com/aryan-astra/maxq",
    status: "active",
    caseStudy: {
      problem:
        "Most mobile music visualizers look generic and rely on heavy effect pipelines that hurt smoothness on mid-range devices.",
      approach:
        "I implemented visual effects in AGSL directly, generating geometry in shader space and keeping the UI surface clean.",
      stack: ["Kotlin", "Android", "AGSL", "Supabase"],
      keyDecisions: [
        "Kept rendering logic in shader code to reduce runtime overhead.",
        "Designed around frame consistency first, visual complexity second.",
        "Built with modular auth/analytics hooks for future expansion.",
      ],
      outcome:
        "A distinctive audio experience with fluid visuals and a clear path to production hardening.",
    },
  },
  {
    slug: "monosect",
    name: "Monosect",
    oneLiner: "A desktop splitter for large videos with size-accurate cuts.",
    description:
      "A C++23 desktop video splitter built with ImGui + GLFW + OpenGL. Splits large video files under Telegram's 2GB limit with GOP-aware cuts and VBR-accurate size targeting. Statically linked, portable EXE.",
    tags: ["C++23", "FFmpeg", "ImGui", "OpenGL", "MinGW"],
    github: "https://github.com/aryan-astra/monosect",
    status: "shipped",
    caseStudy: {
      problem:
        "Creators sharing long videos to messaging apps lose time manually trial-and-error slicing around file limits.",
      approach:
        "Built a native utility with GOP-aware splitting and bitrate-informed segment targeting so outputs land close to the platform size cap.",
      stack: ["C++23", "FFmpeg", "ImGui", "GLFW", "OpenGL"],
      keyDecisions: [
        "Implemented conservative cut strategy to avoid broken keyframe boundaries.",
        "Kept the binary portable and statically linked for frictionless sharing.",
        "Exposed only the controls users actually need for this workflow.",
      ],
      outcome:
        "Turned a repetitive manual task into a one-pass workflow for large file delivery.",
    },
  },
  {
    slug: "img-market",
    name: "img-market",
    oneLiner: "A photo marketplace with layered watermark protection.",
    description:
      "A high-resolution photo marketplace for an institutional client. Two-layer watermarking: visible tiled overlay at upload, invisible LSB forensic watermark per buyer at download. Cloudflare R2 for storage, Razorpay with HMAC webhooks for payments.",
    tags: ["Next.js 15", "Cloudflare R2", "PostgreSQL", "Razorpay", "Hetzner"],
    status: "active",
    caseStudy: {
      problem:
        "Photographers needed a secure sales flow that discourages casual theft and supports buyer accountability.",
      approach:
        "Combined visible and forensic watermarking with a controlled checkout pipeline and webhook verification.",
      stack: ["Next.js", "Cloudflare R2", "PostgreSQL", "Razorpay", "Hetzner"],
      keyDecisions: [
        "Applied visible watermarking at upload time to protect previews.",
        "Embedded buyer-specific forensic marks at download to preserve attribution evidence.",
        "Used signed webhook verification for payment trust.",
      ],
      outcome:
        "Delivered a practical sales platform balancing buyer experience and creator protection.",
    },
  },
  {
    slug: "chatgpt-enhanced",
    name: "ChatGPT Enhanced",
    oneLiner: "A power-user extension built before native memory features existed.",
    description:
      "A Chrome extension that adds persistent memory, improved UI, and conversation management to ChatGPT — before OpenAI shipped any of these natively.",
    tags: ["JavaScript", "Chrome Extension", "DOM"],
    github: "https://github.com/aryan-astra/chatgpt-enhanced",
    status: "archived",
    caseStudy: {
      problem:
        "Early ChatGPT sessions lacked persistence and long-term context tools for daily heavy users.",
      approach:
        "Extended the web app UI with local persistence and conversation management controls directly in the browser.",
      stack: ["JavaScript", "Chrome Extension", "DOM APIs"],
      keyDecisions: [
        "Used lightweight DOM overlays instead of brittle full-page rewrites.",
        "Prioritized quick retrieval of prior context snippets.",
        "Kept architecture simple to adapt to frequent upstream UI changes.",
      ],
      outcome:
        "Provided a daily productivity boost until native platform features matured.",
    },
  },
];

export const skills: Record<string, string[]> = {
  Languages: ["Kotlin", "Python", "TypeScript", "C++", "Java"],
  Frameworks: ["Next.js", "Android SDK", "FastAPI", "Hono"],
  Cloud: ["Cloudflare Workers", "Cloudflare KV", "Cloudflare R2", "Vercel", "Hetzner"],
  Tools: ["Git", "Supabase", "PostgreSQL", "FFmpeg", "Playwright"],
  Concepts: ["PWA", "Chrome Extensions", "LLM Agents", "AGSL Shaders", "Webhook Auth"],
};

export const hackathons: Hackathon[] = [
  {
    event: "Guidewire DevTrails 2026",
    project: "GigSafe",
    description:
      "Gig worker income protection platform with real-time platform outage triggers, zone-based micro-pooling across Chennai, and an Income DNA risk model.",
    team: "Unfiltered Minds",
    result: "Qualified further rounds",
    year: 2026,
  },
  {
    event: "Barclays Hack-O-Hire 2026",
    project: "Barclays PIE",
    description:
      "Pre-delinquency intervention engine for credit risk — flags at-risk accounts before default using behavioral signals and proposes targeted interventions.",
    result: "Qualified further rounds",
    year: 2026,
  },
  {
    event: "Ossome Hacks 3.0",
    project: "SentinelClaw",
    description:
      "AI trading guardrail agent with a YAML policy engine and ArmorClaw enforcement layer. Blocks trades that violate policy; demonstrated on a malicious earnings report scenario.",
    team: "Cyka",
    result: "Participated",
    year: 2026,
  },
  {
    event: "Smart India Hackathon 2025",
    project: "—",
    description: "National-level government hackathon. Competed in the software edition.",
    result: "Participated",
    year: 2025,
  },
];

export const posts: Post[] = [
  {
    slug: "building-things-that-break",
    title: "Building things that break",
    description:
      "Why shipping broken code is better than not shipping at all, and what I learned fixing Arch SRM at 2am.",
    date: "2026-04-10",
    body: [
      "Shipping is a feedback loop, not a graduation ceremony. If people use your work, they will find edge cases you could never invent in a local test run.",
      "The hard part is building recovery muscles: fast rollback, clear messaging, and calm debugging under pressure.",
      "Broken software is not a badge of honor, but fear of breakage is worse. I optimize for short repair cycles instead of imaginary perfection.",
    ],
  },
  {
    slug: "why-i-like-local-ai",
    title: "Why I like local AI",
    description:
      "VOCO runs Qwen3 on a laptop with no API keys. Here's why that matters more than you think.",
    date: "2026-03-22",
    body: [
      "Local AI shifts the tradeoff surface: latency becomes predictable, privacy gets stronger, and cost stops scaling with usage spikes.",
      "You lose some frontier model quality, but gain control and reliability. For automation workflows, that trade can be worth it.",
      "I like systems that keep working on bad Wi-Fi and still feel fast.",
    ],
  },
  {
    slug: "what-hackathons-actually-teach",
    title: "What hackathons actually teach",
    description:
      "It's not the tech. It's learning to cut scope fast and still ship something real.",
    date: "2026-02-14",
    body: [
      "Hackathons reward clear prioritization under ambiguity. Teams that win are usually the ones who simplify the right thing first.",
      "The underrated skill is deciding what to delete before writing it.",
      "Every event teaches the same lesson: scope is a product decision, not just a project management artifact.",
    ],
  },
];
