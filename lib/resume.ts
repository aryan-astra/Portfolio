/**
 * Resume data + LaTeX source.
 * Shared by the mobile in-place renderer and the desktop 3D typewriter.
 */

export type ResumeBlock =
  | { kind: "header"; latex: string }
  | { kind: "section"; latex: string; title: string }
  | { kind: "education"; latex: string }
  | {
      kind: "project";
      latex: string;
      name: string;
      meta: string;
      tech: string;
      bullets: string[];
    }
  | {
      kind: "hackathon";
      latex: string;
      title: string;
      date: string;
      body: string;
    }
  | { kind: "cert"; latex: string }
  | { kind: "skills"; latex: string };

export const RESUME_BLOCKS: ResumeBlock[] = [
  {
    kind: "header",
    latex:
      "\\begin{center}\n  {\\LARGE\\bfseries Aryan Shukla}\\\\\n  +91 73395 79835 · aryanworks@hotmail.com · linkedin.com/in/aryanworks · github.com/aryan-astra\n\\end{center}",
  },
  { kind: "section", latex: "\\section{Education}", title: "Education" },
  {
    kind: "education",
    latex:
      "\\textbf{SRM Institute of Science and Technology}, Chennai \\hfill \\textit{Expected June 2028}\n\\\\Bachelor of Technology, Computer Science and Engineering",
  },
  { kind: "section", latex: "\\section{Projects}", title: "Projects" },
  {
    kind: "project",
    latex:
      "\\proj{Arch — Unofficial SRMIST Academic Portal}{GitHub · archsrm.netlify.app · Jan 2025 – Present}{TypeScript · React 19 · Vite · PWA · Node.js · Express · Redis}",
    name: "Arch — Unofficial SRMIST Academic Portal",
    meta: "GitHub  ·  archsrm.netlify.app  ·  Jan 2025 – Present",
    tech: "TypeScript · React 19 · Vite · PWA · Node.js · Express · Redis",
    bullets: [
      "Rebuilt the SRMIST portal as a mobile-first PWA with a real authentication proxy against the live university backend — genuine session auth via HTTPS, no scraping. Reached 300+ daily active users entirely through word of mouth.",
      "Engineered Redis-backed session persistence, adaptive polling, attendance risk prediction, day-order-aware timetable, and marks trend visualization; integrated VAPID push notifications as a foreground service with startup self-heal recovery.",
    ],
  },
  {
    kind: "project",
    latex:
      "\\proj{VOCO — Offline Autonomous Windows Agent}{GitHub · Nov 2025 – Present}{Python · Ollama · Qwen3:4b · TF-IDF · Random Forest · CLINC150 · Textual TUI}",
    name: "VOCO — Offline Autonomous Windows Agent",
    meta: "GitHub  ·  Nov 2025 – Present",
    tech: "Python · Ollama · Qwen3:4b · TF-IDF · Random Forest · CLINC150 · Textual TUI",
    bullets: [
      "Fully offline, voice-activated Windows automation agent executing browser, file, and OS workflows with zero cloud dependency.",
      "Built a hybrid ML intent router (TF-IDF + Random Forest on CLINC150) achieving 75–85% routing accuracy; sandboxed tool execution, flat-file memory, and a closed-loop ReAct model with structured eval logging of router confidence, step traces, and retry counts.",
    ],
  },
  {
    kind: "project",
    latex:
      "\\proj{MaxQ — Android Music Player}{GitHub · Sep 2025 – Present}{Kotlin · Jetpack Compose · Media3 ExoPlayer · AGSL · MediaSession · Retrofit · DataStore}",
    name: "MaxQ — Android Music Player",
    meta: "GitHub  ·  Sep 2025 – Present",
    tech: "Kotlin · Jetpack Compose · Media3 ExoPlayer · AGSL · MediaSession · Retrofit · DataStore",
    bullets: [
      "Engineered Apple Music-style full-screen player with word-level lyrics sync (TTML/LRC), dynamic artwork accent extraction, and a multi-instance latency-aware racing system with quality cascade for lossless playback.",
      "Custom AGSL GlassSurface shader via SDF refraction (API 33+) with RenderEffect fallback to API 26; isolated jank via MainScaffold playbackState collection profiling and per-item waveform tuning.",
    ],
  },
  {
    kind: "project",
    latex:
      "\\proj{Monosect — Windows Video Splitter}{GitHub · v1.1.0 Released · Feb 2026 – Present}{C++23 · ImGui · GLFW · OpenGL · FFmpeg · GitHub Actions}",
    name: "Monosect — Windows Video Splitter",
    meta: "GitHub  ·  v1.1.0 Released  ·  Feb 2026 – Present",
    tech: "C++23 · ImGui · GLFW · OpenGL · FFmpeg · GitHub Actions",
    bullets: [
      "Native Windows GUI for splitting large videos under Telegram's 2 GB limit; GOP-aware keyframe detection, VBR-safe size precision engine, and a multi-format FFmpeg pipeline.",
      "Automated release via GitHub Actions (tag push → portable ZIP + standalone EXE with SHA256 verification); v1.1.0 publicly shipped.",
    ],
  },
  {
    kind: "project",
    latex:
      "\\proj{Modus — AI Platform Enhancement Extension}{GitHub · v3.5.2 Released · themodus.netlify.app · Dec 2024 – Present}{JavaScript · Chrome Extension API · Playwright · GitHub Actions}",
    name: "Modus — AI Platform Enhancement Extension",
    meta: "GitHub  ·  v3.5.2 Released  ·  themodus.netlify.app  ·  Dec 2024 – Present",
    tech: "JavaScript · Chrome Extension API · Playwright · GitHub Actions",
    bullets: [
      "Browser extension enhancing ChatGPT with a typing lag fix, compact icon sidebar, bulk archive/delete via injected checkboxes, model badge, context usage bar, and date-grouped conversation history.",
      "Automated release pipeline via GitHub Actions (manifest version bump → zip packaging + SHA256 verification); v3.5.2 publicly shipped with a companion website.",
    ],
  },
  {
    kind: "project",
    latex:
      "\\proj{Ratify — Commit Governance System}{GitHub · Feb 2026 – Mar 2026}{TypeScript · Next.js · Node.js · PostgreSQL · CLI (ratify)}",
    name: "Ratify — Commit Governance System",
    meta: "GitHub  ·  Feb 2026 – Mar 2026",
    tech: "TypeScript · Next.js · Node.js · PostgreSQL · CLI (ratify)",
    bullets: [
      "CLI tool (ratify submit) wrapping git to capture commit metadata and route changes through a role-tiered approval workflow (developer → manager → senior manager) based on file-risk classification, with a Next.js dashboard for hierarchical review.",
    ],
  },
  {
    kind: "section",
    latex: "\\section{Hackathons \\& Competitions}",
    title: "Hackathons & Competitions",
  },
  {
    kind: "hackathon",
    latex: "\\hack{Ossome Hacks 3.0 — Security Track (Team Cyka)}{Mar 2026}",
    title: "Ossome Hacks 3.0 — Security Track (Team Cyka)",
    date: "Mar 2026",
    body: "OpenClaw: YAML-policy-governed agentic threat response with ArmorClaw enforcement for real-time adversarial defense.",
  },
  {
    kind: "hackathon",
    latex:
      "\\hack{Guidewire DevTrails 2026 — GigSafe (Team Unfiltered Minds)}{2026}",
    title: "Guidewire DevTrails 2026 — GigSafe (Team Unfiltered Minds)",
    date: "2026",
    body: "Gig-worker micro-insurance platform; confidence-tiered fraud scoring, graph-based ring detection (R1–R5), fairness-preserving telemetry protection. Working Next.js demo delivered.",
  },
  {
    kind: "hackathon",
    latex: "\\hack{Barclays Hack-O-Hire 2026}{2026}",
    title: "Barclays Hack-O-Hire 2026",
    date: "2026",
    body: "Financial Risk Prediction Engine — Random Forest pipeline (≈82% accuracy) for pre-delinquency loan default detection.",
  },
  {
    kind: "hackathon",
    latex: "\\hack{HeisenHack — ACM SIGKDD, SRMIST}{Oct 2025}",
    title: "HeisenHack — ACM SIGKDD, SRMIST",
    date: "Oct 2025",
    body: "Revenue-sharing web app; virtual equity allocation, payout logic, incentive-based discount models.",
  },
  {
    kind: "hackathon",
    latex: "\\hack{DayZero — CodeNex SRMIST (36hr)}{Apr 2025}",
    title: "DayZero — CodeNex SRMIST (36hr)",
    date: "Apr 2025",
    body: "Virtual clothing try-on using Three.js, WebGL, GSAP physics animations.",
  },
  { kind: "section", latex: "\\section{Certifications}", title: "Certifications" },
  {
    kind: "cert",
    latex:
      "\\textbf{NPTEL Elite} — Programming in Java, IIT Kharagpur \\hfill \\textit{Jul–Oct 2025}",
  },
  { kind: "section", latex: "\\section{Skills}", title: "Skills" },
  {
    kind: "skills",
    latex:
      "\\textbf{Languages:} Python, TypeScript, JavaScript, Kotlin, Java, C/C++\n\\textbf{AI \\& ML:} MLOps, Agentic Systems, LLM Integration, scikit-learn, Random Forest, TF-IDF, Ollama, OpenAI, Anthropic, LangChain\n\\textbf{Frontend:} React, Next.js, Vite, Tailwind, shadcn/ui, Framer Motion, Jetpack Compose, PWA, Chrome Extension API\n\\textbf{Backend & Infra:} FastAPI, Node.js, Express, Redis, Docker, GitHub Actions, CI/CD, Cloudflare, Netlify, Fly.io\n\\textbf{Databases:} MySQL, PostgreSQL\n\\textbf{Tools:} Git, FFmpeg, Linux, SSH, Android Studio",
  },
];

/** Verbatim source for the `.tex` download button. */
export const LATEX_SOURCE = String.raw`%──────────────────────────────────────────────────────────────────────────────
%  Aryan Shukla — Resume
%──────────────────────────────────────────────────────────────────────────────
\documentclass[10pt, letterpaper]{article}
\usepackage[top=0.40in, bottom=0.38in, left=0.50in, right=0.50in]{geometry}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{charter}
\usepackage{microtype}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{titlesec}
\pagestyle{empty}
\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}
\titleformat{\section}{\bfseries\small\scshape\uppercase}{}{0em}{}[\vspace{-5pt}\rule{\linewidth}{0.45pt}]
\titlespacing*{\section}{0pt}{4pt}{2pt}
\setlist[itemize]{leftmargin=1.35em, label=\textbullet, topsep=1pt, itemsep=0.2pt, parsep=0pt}
\newcommand{\proj}[3]{\noindent\textbf{#1}\hfill\small{#2}\\[-3pt]\small\textit{#3}}
\newcommand{\hack}[3]{\noindent\textbf{#1}\hfill\textit{\small #2}\\[-1pt]\small #3}
\begin{document}
% See website for the full rendered resume.
\end{document}
`;

/* ── Static resume asset paths (user-supplied; do not generate client-side) ── */
export const RESUME_PDF_PATH = "/resume/Aryan-Shukla-Resume.pdf";
export const RESUME_JPG_PATH = "/resume/Aryan-Shukla-Resume.jpg";

/**
 * Role variants — currently all point at the general PDF/JPEG.
 * TODO: replace each entry with a tailored, role-specific build of the
 * resume once those PDFs are produced.
 */
export interface RoleVariant {
  id: string;
  label: string;
  pdf: string;
  jpg: string;
}

export const ROLE_VARIANTS: RoleVariant[] = [
  // TODO: tailored Frontend PDF
  { id: "frontend",  label: "Frontend",       pdf: RESUME_PDF_PATH, jpg: RESUME_JPG_PATH },
  // TODO: tailored Backend PDF
  { id: "backend",   label: "Backend",        pdf: RESUME_PDF_PATH, jpg: RESUME_JPG_PATH },
  // TODO: tailored Full-Stack PDF
  { id: "fullstack", label: "Full-Stack",     pdf: RESUME_PDF_PATH, jpg: RESUME_JPG_PATH },
  // TODO: tailored AI / ML PDF
  { id: "ai",        label: "AI / ML",        pdf: RESUME_PDF_PATH, jpg: RESUME_JPG_PATH },
  // TODO: tailored Android PDF
  { id: "android",   label: "Android",        pdf: RESUME_PDF_PATH, jpg: RESUME_JPG_PATH },
  // TODO: tailored Systems / low-level PDF
  { id: "systems",   label: "Systems",        pdf: RESUME_PDF_PATH, jpg: RESUME_JPG_PATH },
  // TODO: hackathon highlight reel
  { id: "hackathon", label: "Hackathon-ready", pdf: RESUME_PDF_PATH, jpg: RESUME_JPG_PATH },
];
