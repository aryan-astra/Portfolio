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

export const heroSubtext = "I'm Aryan — a CS sophomore at SRMIST building things people actually open. Sometimes they work. Sometimes they break. Both are useful.";

export const contact = {
  twitter: "https://x.com/aryanxastra",
  linkedin: "https://linkedin.com/in/aryanworks",
};

export const projects: Project[] = [
  // FEATURED
  {
    slug: "arch-srm",
    name: "Arch SRM",
    oneLiner: "300+ students use this daily instead of the broken official portal.",
    description:
      "A mobile-first PWA replacing SRMIST's official academic portal. Real session auth against the live university backend, zero scraping. Redis-backed persistence, adaptive attendance polling, grade-boundary projections, day-order timetable, and VAPID push notifications with foreground self-heal.",
    tags: ["Next.js", "Cloudflare Workers", "Hono", "KV", "PWA", "Redis"],
    github: "https://github.com/aryan-astra/arch-srm",
    live: "https://arch-srm.pages.dev",
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
    github: "https://github.com/aryan-astra/voco",
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

  // MAIN PROJECTS
  {
    slug: "maxq",
    name: "MaxQ",
    oneLiner: "An Android music player with visuals computed entirely in shader code.",
    description:
      "Android music player (Kotlin/Compose/Media3) with a pure AGSL Liquid Glass visualizer — SDF refraction geometry generated directly in AGSL shader code, no image-processing libraries. RenderEffect blur fallback for API 26–32. Word-level TTML/LRC lyrics sync. Multi-instance latency-aware racing for lossless quality.",
    tags: ["Kotlin", "Jetpack Compose", "Media3", "AGSL", "MediaSession"],
    github: "https://github.com/aryan-astra/maxq",
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
    github: "https://github.com/aryan-astra/monosect",
    live: "https://github.com/aryan-astra/monosect/releases/tag/v1.1.0",
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
    github: "https://github.com/aryan-astra/modus",
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
    github: "https://github.com/aryan-astra/ratify",
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

  // SECONDARY PROJECTS
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
];

export const posts: Post[] = [
  {
    slug: "building-things-that-break",
    title: "Building things that break",
    description:
      "Why shipping broken code is better than not shipping at all, and what I learned fixing Arch SRM at 2am.",
    date: "2026-04-10",
    body: [
      "I used to treat shipping as the end of a project, a neat ribbon tied around finished work. Over time I learned shipping is the opening of a conversation with users. Once real people use your product, they reveal failure modes you could never predict in a local development environment.",
      "The first time Arch SRM broke in production was a humbling lesson: a third-party session cookie rotated unexpectedly and half the campus lost access. The outage forced me to prioritise recovery ergonomics over feature creep.",
      "Recovery ergonomics means clear messaging, fast rollback, and reproducible postmortems. We rebuilt our deploy playbook so a single command could revert the Workers proxy and trigger a status page update.",
      "Short repair cycles beat long polish. When you aim for perfection before shipping, you delay feedback. When you aim for safe shipping with quick rollbacks, you get feedback sooner and can iterate toward real reliability.",
      "Engineering for failure also means designing for observability. We added structured logs, trace IDs, and a small on-call checklist so the on-call person didn't have to guess where to start at 2am.",
      "People conflate 'broken' with 'bad'. Broken software is only bad when it's hard to fix. My goal shifted to making fixes fast and low-risk instead of preventing every conceivable bug before the first user sees the product.",
      "The cultural change was the hardest part: convincing stakeholders that it's OK to ship early as long as the team can recover quickly. The payoff was measurable: faster iterations, more honest user feedback, and ultimately a more resilient product.",
      "If you build things people actually open, expect them to break. Make the breaking useful: instrument it, learn from it, and make the next release meaningfully better.",
    ],
  },
  {
    slug: "why-i-like-local-ai",
    title: "Why I like local AI",
    description:
      "VOCO runs Qwen3 on a laptop with no API keys. Here's why that matters more than you think.",
    date: "2026-03-22",
    body: [
      "Local AI changes the tradeoffs we usually accept. Instead of relying on a cloud endpoint where latency, privacy, and cost are uncertain, you get predictability: a model on disk that responds in a fixed time and whose behavior you control.",
      "For automation workflows, that predictability matters more than peak model accuracy. If a background job will trigger a sequence of actions, you prefer consistent behavior over occasional brilliance followed by downtime.",
      "Running locally also simplifies privacy and compliance. There are contexts where data can never leave the device. Local models remove the need for elaborate anonymisation workflows and reduce blast radius.",
      "The tradeoff is obvious: you generally work with a smaller or older model. But engineering is about choosing the right tool for the job. For many automation tasks, locally-run mid-sized models are entirely sufficient.",
      "Another practical benefit is cost. Cloud inference costs scale with traffic, which can make a useful product economically infeasible. A one-time hardware investment and careful caching can be far cheaper at scale.",
      "Finally, local-first design forces better interfaces. If the model is on-device, latency is lower and you can create tighter UX loops. That changes how you structure prompts, retries, and fallbacks.",
      "VOCO's router architecture (fast TF-IDF classifier, then LLM only when needed) is a practical takeaway: choose a hybrid stack where lightweight components handle the routine, and the heavy model is reserved for ambiguity.",
      "Local AI is not a silver bullet, but it provides control. For me, that control is the feature.",
    ],
  },
  {
    slug: "what-hackathons-actually-teach",
    title: "What hackathons actually teach",
    description:
      "It's not the tech. It's learning to cut scope fast and still ship something real.",
    date: "2026-02-14",
    body: [
      "At a hackathon, the clock reshapes priorities. You quickly learn that adding one feature often costs two. The real skill is choosing what to cut so the core remains polished and testable.",
      "Winning teams rarely have the flashiest stack; they have the clearest scope. They pick a single user action and make it delightful under constraint.",
      "Hackathons also teach rapid validation. The quickest way to know if an idea resonates is to get a prototype in front of real users and watch where they stumble.",
      "You'll learn to automate the mundane: deploy scripts, seed databases, and small test harnesses that save time during the event and after.",
      "Working in small cross-functional teams reveals communication friction. The teams that succeed are the teams that make decisions explicit and visible to everyone.",
      "Finally, hackathons teach humility: your first idea will rarely be the final one. Iterate, prune, and accept that pivoting is progress.",
      "If you treat a hackathon like a miniature product cycle — with a single hypothesis, rapid validation, and ruthless scope control — you will ship more useful things.",
      "Those lessons carry over to regular product work: small bets, fast feedback, and clear scope often beat big plans executed slowly.",
    ],
  },
];

