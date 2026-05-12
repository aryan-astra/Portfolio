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
  secondary?: boolean; // renders in compact list, not main grid
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

export const heroSubtext = `I'm Aryan — a CS sophomore at SRMIST building things people actually open.
Sometimes they work. Sometimes they break. Both are useful.`;

export const contact = {
  email: "aryanworks@hotmail.com",
  github: "https://github.com/aryan-astra",
  twitter: "https://x.com/aryanxastra",
  linkedin: "https://linkedin.com/in/aryanworks",
};

export const projects: Project[] = [
  // ─── FEATURED (featured: true) ──────────────────────────────────────────────
  {
    slug: "arch-srm",
    name: "Arch SRM",
    oneLiner: "300+ students use this daily instead of the broken official portal.",
    description:
      "A mobile-first PWA replacing SRMIST's official academic portal. Real session auth against the live university backend, zero scraping. Redis-backed persistence, adaptive attendance polling, grade-boundary projections, day-order timetable, and VAPID push notifications with foreground self-heal.",
    tags: ["Next.js", "Cloudflare Workers", "Hono", "KV", "PWA", "Redis"],
    github: "https://github.com/aryan-astra/Arch",
    live: "https://archsrm.netlify.app",
    status: "active",
    featured: true,
    impact: "300+ DAU · word-of-mouth only",
    caseStudy: {
      problem:
        "Students juggled three unstable university portals for attendance, marks, and timetable. The mobile experience was unusable. Sessions expired randomly.",
      approach:
        "One fast PWA with a Cloudflare Workers proxy that holds the real university session. Aggressive KV caching means the UI responds in milliseconds even during peak exam-season traffic.",
      stack: ["Next.js", "Cloudflare Workers", "Hono", "Cloudflare KV", "Redis", "PWA"],
      keyDecisions: [
        "Real HTTPS session auth — no scraping, no credentials stored in plain text.",
        "Edge-first: every read hits KV before touching the university backend.",
        "Attendance risk engine flags at-risk days before the deadline, not after.",
      ],
      outcome:
        "300+ daily active users. Became the default utility app for a significant slice of the SRMIST student population, acquired entirely through word-of-mouth.",
    },
  },
  {
    slug: "voco",
    name: "VOCO",
    oneLiner: "A fully offline Windows agent. No API keys, no cloud, no excuses.",
    description:
      "Windows OS automation agent powered by a local Qwen3:4b model via Ollama. Controls the browser through Playwright and the desktop through pyautogui. ML intent router (TF-IDF + Random Forest on CLINC150, 75–85% accuracy) dispatches commands to a closed-loop ReAct executor with structured eval logging.",
    tags: ["Python", "Qwen3", "Ollama", "Playwright", "scikit-learn", "Textual TUI"],
    github: "https://github.com/aryan-astra/Voco-Autonomous-Agent",
    status: "active",
    featured: true,
    impact: "Fully offline — no API key required",
    caseStudy: {
      problem:
        "Every AI assistant assumes cloud APIs and stable internet. I wanted private, local-first automation for constrained or air-gapped environments.",
      approach:
        "VOCO runs a Qwen3 model locally via Ollama. A TF-IDF + Random Forest router classifies intent and dispatches to specialised tools (browser, file system, OS). A closed-loop ReAct executor retries on failure and logs confidence, step traces, and retry counts.",
      stack: ["Python", "Qwen3", "Ollama", "Playwright", "pyautogui", "scikit-learn"],
      keyDecisions: [
        "ML router first: fast classification means the LLM only runs when necessary.",
        "ReAct loop with explicit success criteria prevents runaway execution.",
        "Structured eval log schema enables empirical measurement of routing accuracy.",
      ],
      outcome:
        "A working demo of private local AI automation. Reproducible eval pipeline for measuring router improvements.",
    },
  },

    // ─── MAIN PROJECTS (featured: false, shown in primary grid) ─────────────────
  {
    slug: "maxq",
    name: "MaxQ",
    oneLiner: "An Android music player with visuals computed entirely in shader code.",
    description:
      "Android music player (Kotlin/Compose/Media3) with a pure AGSL Liquid Glass visualizer — SDF refraction geometry generated directly in AGSL shader code, no image-processing libraries. RenderEffect blur fallback for API 26–32. Word-level TTML/LRC lyrics sync. Multi-instance latency-aware racing for lossless quality.",
    tags: ["Kotlin", "Jetpack Compose", "Media3", "AGSL", "MediaSession"],
    github: "https://github.com/aryan-astra/MaxQ",
    status: "active",
    featured: false,
    caseStudy: {
      problem:
        "Most Android music visualizers are slow, generic, and rely on effect pipelines that wreck frame rates on mid-range hardware.",
      approach:
        "All visual geometry is computed in AGSL shader space. The CPU never touches rendering math. Jank was traced to MainScaffold collecting playbackState ticks — fixed by isolating the state collection boundary.",
      stack: ["Kotlin", "Jetpack Compose", "Media3 ExoPlayer", "AGSL", "DataStore"],
      keyDecisions: [
        "SDF refraction in shader: no bitmaps, no image processing, pure geometry.",
        "Tiered API fallback: full AGSL on API 33+, RenderEffect blur on 31–32, tinted surface on 26–30.",
        "Performance is priority 1, visual complexity is priority 2.",
      ],
      outcome:
        "Fluid shader visuals with consistent frame budget. Supabase auth and analytics pipeline in progress.",
    },
  },
  {
    slug: "monosect",
    name: "Monosect",
    oneLiner: "Native desktop video splitter. Hits Telegram's 2 GB limit on the first try.",
    description:
      "C++23 desktop application (ImGui + GLFW + OpenGL) that splits large video files under Telegram's 2 GB hard limit. GOP-aware keyframe detection ensures no broken frames at cut boundaries. VBR-safe size precision engine accounts for variable bitrate when targeting segment sizes. Statically linked portable EXE.",
    tags: ["C++23", "FFmpeg", "ImGui", "GLFW", "OpenGL", "GitHub Actions"],
    github: "https://github.com/aryan-astra/Monosect",
    live: "https://github.com/aryan-astra/Monosect/releases/tag/v1.1.0",
    status: "shipped",
    featured: false,
    caseStudy: {
      problem:
        "Creators sharing long videos to Telegram spend time manually slicing and re-encoding around the 2 GB limit, often overshooting and having to retry.",
      approach:
        "GOP-aware cutting guarantees keyframe boundaries. A bitrate-informed size engine pre-computes segment lengths so the first pass lands within tolerance.",
      stack: ["C++23", "FFmpeg", "ImGui", "GLFW", "OpenGL", "GitHub Actions"],
      keyDecisions: [
        "Conservative keyframe selection: always pick the earlier boundary to avoid overshooting.",
        "Static linking: one EXE, no redistributable dependencies, drag-and-drop install.",
        "GitHub Actions releases: tag push → portable ZIP + EXE with SHA256 checksum.",
      ],
      outcome:
        "v1.1.0 publicly shipped. Turned a repetitive multi-attempt task into a single-pass workflow.",
    },
  },
  {
    slug: "modus",
    name: "Modus",
    oneLiner: "A browser extension that makes AI platforms actually usable.",
    description:
      "Chrome extension (formerly ChatGPT Enhanced) enhancing AI chat platforms with: typing lag fix, compact icon sidebar, bulk archive/delete via injected checkboxes, model badge display, context usage bar, and date-grouped conversation history. v3.5.2 publicly shipped. Expanding to Claude and Gemini.",
    tags: ["JavaScript", "Chrome Extension API", "Playwright", "GitHub Actions"],
    github: "https://github.com/aryan-astra/Modus",
    live: "https://themodus.netlify.app",
    status: "active",
    featured: false,
    caseStudy: {
      problem:
        "AI chat platforms have notoriously broken UX — missing bulk actions, no context visibility, laggy input. Power users suffer quietly.",
      approach:
        "DOM injection with minimal surface area. No full-page rewrites that break on upstream UI changes. Each feature is an independent injector with its own failure boundary.",
      stack: ["JavaScript", "Chrome Extension API", "Playwright", "GitHub Actions"],
      keyDecisions: [
        "Injectors are isolated: one feature breaking doesn't kill the others.",
        "GitHub Actions pipeline: manifest version bump → zip + SHA256 → release.",
        "Multi-platform expansion (Claude, Gemini) is the next milestone.",
      ],
      outcome:
        "v3.5.2 publicly shipped. Companion website live at themodus.netlify.app.",
    },
  },
  {
    slug: "ratify",
    name: "Ratify",
    oneLiner: "A CLI that routes commits through a role-tiered approval chain before they land.",
    description:
      "TypeScript CLI (`ratify submit`) wrapping git to capture commit metadata and route changes through a developer → manager → senior manager approval workflow based on file-risk classification. Next.js dashboard for hierarchical review. PostgreSQL persistence.",
    tags: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "CLI"],
    github: "https://github.com/aryan-astra/Ratify",
    status: "active",
    featured: false,
    caseStudy: {
      problem:
        "Teams with multiple seniority levels have no lightweight way to enforce a review gate on high-risk file changes without a full-blown CI/CD overhaul.",
      approach:
        "A thin CLI wrapper over git surfaces risk classification at commit time. A Next.js dashboard gives managers a queue-style view of pending approvals.",
      stack: ["TypeScript", "Next.js", "Node.js", "PostgreSQL"],
      keyDecisions: [
        "Risk classification is file-path based — no AST parsing, zero latency.",
        "CLI stays thin: it captures metadata, delegates routing logic to the API.",
        "Dashboard is role-aware: developers see their own queue, managers see their team's.",
      ],
      outcome:
        "Working approval pipeline with role-tiered routing and a real-time review dashboard.",
    },
  },

    // ─── SECONDARY PROJECTS (shown in compact list, not full cards) ──────────────
  {
    slug: "rna-synthesis",
    name: "RNA Synthesis Visualizer",
    oneLiner: "DNA → RNA transcription visualizer with 3D helix and animated base-pair display.",
    description:
      "Interactive computational biology tool (Python / Tkinter / Matplotlib) that animates the DNA-to-RNA transcription process step by step. Renders a 3D double helix, highlights complementary base pairs, and visualises the polymerase scan in real time. Built for a first-semester comp-bio course, deployed as a desktop GUI.",
    tags: ["Python", "Tkinter", "Matplotlib", "Bioinformatics", "3D Visualisation"],
    github: "https://github.com/aryan-astra/RNA-Synthesis",
    status: "shipped",
    secondary: true,
    caseStudy: {
      problem:
        "Transcription diagrams in textbooks are static. A first-semester course needed a dynamic tool that makes base-pair complementarity and polymerase traversal intuitive.",
      approach:
        "Pure Python desktop app with Tkinter for controls and Matplotlib for the animated 3D helix. Each transcription step is rendered frame by frame so the visual matches the algorithmic process.",
      stack: ["Python", "Tkinter", "Matplotlib"],
      keyDecisions: [
        "Matplotlib 3D axes for helix geometry — no external game engines or WebGL.",
        "Animated frame loop tied to transcription state, not a timer, for educational clarity.",
        "Self-contained desktop GUI: one script, zero server dependency.",
      ],
      outcome:
        "Shipped for the computational biology module. Demonstrates Python visualisation and biology domain awareness.",
    },
  },
  {
    slug: "img-market",
    name: "img-market",
    oneLiner: "Photo marketplace with two-layer watermarking and forensic buyer attribution.",
    description:
      "High-resolution photo marketplace for an institutional client. Visible tiled watermark applied at upload via sharp; invisible LSB forensic watermark embedded per-buyer at download for attribution evidence. Cloudflare R2 storage with signed expiring URLs post-payment. Razorpay with HMAC webhook verification.",
    tags: ["Next.js 15", "Cloudflare R2", "PostgreSQL", "Razorpay", "Hetzner"],
    status: "active",
    secondary: true,
    caseStudy: {
      problem:
        "Photography clients need a sales flow that discourages casual theft and supports buyer accountability without degrading the purchase experience.",
      approach:
        "Two watermark layers: visible deterrent at upload, invisible forensic proof at download. Signed R2 URLs expire after checkout, preventing link sharing.",
      stack: ["Next.js 15", "Cloudflare R2", "PostgreSQL", "Razorpay"],
      keyDecisions: [
        "Visible watermark at upload time protects all previews by default.",
        "LSB forensic mark is buyer-specific — provides proof without blocking usability.",
        "HMAC webhook verification prevents fraudulent payment confirmations.",
      ],
      outcome: "Operational for client. Two-layer protection pipeline verified end-to-end.",
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
  {
    event: "HeisenHack 2025",
    project: "Revenue Share",
    description:
      "A revenue-sharing prototype built under time pressure for an ACM SIGKDD hackathon track, scoped down hard to avoid spending the whole event on dashboard glitter.",
    result: "Participated",
    year: 2025,
  },
  {
    event: "DayZero CodeNex 2025",
    project: "Virtual Try-On",
    description:
      "A WebGL-based virtual try-on concept built to make the demo feel alive without pretending the problem was fully solved in 36 hours.",
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
      "At 2:07am Zoho's signin.js hash changed from 6ab006 to 2bdb9d and Arch SRM's auth broke for every user at once. That's the kind of alert that teaches you what ownership actually feels like before you've had coffee.",
      "By 2:14am my phone was doing that thing where it keeps lighting up with the same message from different people. Students couldn't check attendance, and the timing was perfect in the worst possible way because exams were close enough to make every missing percentage feel expensive.",
      "I opened the logs, confirmed the hash diff, and stopped pretending this was a cute little bug. It was a production dependency changing underneath me, which is a polite way of saying somebody else's code decided to ruin my sleep schedule.",
      "The hotfix was boring in the best possible way: reproduce locally, confirm the new hash, patch the auth flow, and make sure the fallback didn't turn into a second failure. Nothing glamorous, just a very calm sequence of steps at a very uncalm hour.",
      "At 3am I deployed to Cloudflare Pages and watched the build land like it had somewhere better to be. There is a specific kind of relief when the page comes back and the messages stop piling up. It's not joy. It's a temporary ceasefire.",
      "The part people skip in the success story is the social fallout. If students can't open the portal, they do not care that the incident was technically interesting. They care that their attendance percentage is now a personal threat.",
      "That night clarified the difference between shipping a repo and shipping a product. A repo exists when you remember it. A product exists when other people rely on it, and that means failures stop being abstract immediately.",
      "If you want real users, you also get real responsibility. You own the bug, the rollback, the message thread, the embarrassment, and the fix. That is the deal. Accountability is the difference between a GitHub project and something 300 students actually open.",
    ],
  },
  {
    slug: "why-i-like-local-ai",
    title: "Why I like local AI",
    description:
      "VOCO runs Qwen3 on a laptop with no API keys. Here's why that matters more than you think.",
    date: "2026-03-22",
    body: [
      "VOCO started from a simple annoyance: every assistant I tried assumed a cloud connection, a paid API key, and an obedient internet connection. I wanted something that still worked when all of those assumptions died.",
      "The first time I watched Qwen3:4b run a Playwright automation task on a laptop with no internet, it felt less like a demo and more like a small engineering victory. The machine was fully offline, the browser still moved, and nobody had to ask permission from a vendor.",
      "That experience changed the shape of the project. Offline-first is not just about privacy. It also makes you stop treating the model as a magic oracle and start treating it like one component in a system that should be measured, routed, and sometimes ignored.",
      "The ML router in VOCO exists because an LLM should not be the first thing touching every command. TF-IDF plus a Random Forest gets the obvious cases out of the way. The model only wakes up when there is actually something ambiguous to do.",
      "That distinction matters because open-loop planners are fragile in the real world. They sound impressive right up until the browser changes, a modal appears, or a button moves six pixels and the whole plan falls apart. Closed-loop execution is uglier, but ugliness is often what makes it survive contact with reality.",
      "There is also the unromantic benefit of not needing an API key. No rate limits. No surprise bills. No silent quota ceiling deciding whether your week goes smoothly. Reproducibility becomes your problem again, which is annoying, but also honest.",
      "Privacy is not the only reason I like local AI, but it is the easiest one to explain. Data stays on the device, the inference stack is yours, and the whole thing feels less like borrowing a service and more like owning a machine.",
      "The bigger shift is psychological. Once you own the model runtime, you stop asking whether the cloud allows a task and start asking whether your own system is disciplined enough to do it. That is a much better question.",
    ],
  },
  {
    slug: "what-hackathons-actually-teach",
    title: "What hackathons actually teach",
    description:
      "It's not the tech. It's learning to cut scope fast and still ship something real.",
    date: "2026-02-14",
    body: [
      "Across five hackathons the pattern is embarrassingly consistent: scope collapses. It happens at SIH, HeisenHack, DayZero, Ossome Hacks, Guidewire DevTrails, Barclays Hack-O-Hire. The name changes, the panic does not.",
      "GigSafe was the clearest example. In Phase 1 we lost stars because we missed the core insurance requirement. That's the sort of feedback that lands like a brick because it is both correct and completely unavoidable.",
      "Phase 2 was where we did the classic hackathon thing: ship five original innovations, get the demo into shape, and realise the elimination already happened while we were congratulating ourselves on the architecture.",
      "That hurts, but it also teaches something useful. Hackathons are not about proving you can build everything. They are about proving you can decide what matters, fast, while the clock keeps getting louder.",
      "The Barclays experience was almost the opposite in tone but not in lesson. We shipped a Random Forest pipeline to 82% accuracy in 24 hours, which sounds neat until you remember that the real competition is against time, not the model.",
      "What nobody tells you is how much of the event is actually about cutting. You cut slides, features, polish, alternate flows, and sometimes the original idea, because a coherent demo beats a sprawling mess every single time.",
      "That is why hackathons are useful even when you do not place. They force you to practice ruthless scope control under pressure, and university courses rarely simulate that kind of compression.",
      "The actual lesson is not how to win. It is how to salvage a product shape while the deadline is already trying to kill it. That is a real engineering skill, and it shows up everywhere later.",
    ],
  },
];

