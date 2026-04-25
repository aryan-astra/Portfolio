export type Project = {
  name: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
  status: "active" | "shipped" | "archived";
};

export type Hackathon = {
  event: string;
  project: string;
  description: string;
  team?: string;
  result: string;
  year: number;
};

export const projects: Project[] = [
  {
    name: "Arch SRM",
    description:
      "A PWA for SRMIST students replacing the broken official portal. Attendance tracking, timetable, marks with grade boundary projections, mess schedule, and academic calendar. 300+ daily active users. Runs entirely on Cloudflare Workers + Hono + KV with zero cold starts.",
    tags: ["Next.js", "Cloudflare Workers", "Hono", "KV", "PWA"],
    github: "https://github.com/aryan-astra/arch-srm",
    live: "https://arch-srm.pages.dev",
    status: "active",
  },
  {
    name: "MaxQ",
    description:
      "An Android music player with a pure AGSL Liquid Glass shader visualizer — no image processing libraries, geometry computed directly in shader code. Supabase auth and analytics pipeline in progress.",
    tags: ["Kotlin", "Android", "AGSL", "Supabase"],
    github: "https://github.com/aryan-astra/maxq",
    status: "active",
  },
  {
    name: "VOCO",
    description:
      "An offline Windows OS automation agent powered by a local LLM (Qwen3). No cloud dependency, no API calls. Controls the browser via Playwright and the OS via pyautogui. Designed for the IIMA Ventures AI Summer Residency.",
    tags: ["Python", "Qwen3", "Playwright", "pyautogui", "LLM"],
    github: "https://github.com/aryan-astra/voco",
    status: "active",
  },
  {
    name: "Monosect",
    description:
      "A C++23 desktop video splitter built with ImGui + GLFW + OpenGL. Splits large video files under Telegram's 2GB limit with GOP-aware cuts and VBR-accurate size targeting. Statically linked, portable EXE.",
    tags: ["C++23", "FFmpeg", "ImGui", "OpenGL", "MinGW"],
    github: "https://github.com/aryan-astra/monosect",
    status: "shipped",
  },
  {
    name: "img-market",
    description:
      "A high-resolution photo marketplace for an institutional client. Two-layer watermarking: visible tiled overlay at upload, invisible LSB forensic watermark per buyer at download. Cloudflare R2 for storage, Razorpay with HMAC webhooks for payments.",
    tags: ["Next.js 15", "Cloudflare R2", "PostgreSQL", "Razorpay", "Hetzner"],
    status: "active",
  },
  {
    name: "ChatGPT Enhanced",
    description:
      "A Chrome extension that adds persistent memory, improved UI, and conversation management to ChatGPT — before OpenAI shipped any of these natively.",
    tags: ["JavaScript", "Chrome Extension", "DOM"],
    github: "https://github.com/aryan-astra/chatgpt-enhanced",
    status: "archived",
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
