"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FileText, Image as ImageIcon } from "@phosphor-icons/react";
import {
  RESUME_BLOCKS,
  type ResumeBlock,
  type RoleVariant,
} from "@/lib/resume";
import ResumeRoleBubble from "./ResumeRoleBubble";

/* ──────────────────────────────────────────────────────────────
 *  MobileResumeDoc
 *  Single-column parchment view. Each block:
 *    1. Types its LaTeX in place at the line's final row.
 *    2. Cross-fades into its rendered form on the same row.
 *  Total budget ≈ 2.5 s for the full sequence.
 * ────────────────────────────────────────────────────────────── */

const BLOCK_TYPING_MS = 110;   // duration of typing per block
const BLOCK_STAGGER_MS = 40;   // delay between blocks starting
const COMMIT_MS = 180;         // crossfade time

const FONT_STACK =
  '"Charter","Bitstream Charter","Sitka Text",Cambria,"Source Serif Pro",Georgia,serif';

type BlockState = "pending" | "typing" | "rendered";

export default function MobileResumeDoc() {
  const reducedMotion = useReducedMotion();
  const [states, setStates] = useState<BlockState[]>(() =>
    RESUME_BLOCKS.map(() => "pending"),
  );
  const [typedChars, setTypedChars] = useState<number[]>(() =>
    RESUME_BLOCKS.map(() => 0),
  );
  const [selectedRole, setSelectedRole] = useState<RoleVariant | null>(null);
  const cancelledRef = useRef(false);

  /* ── Run the entire sequence in a single coordinated effect ── */
  useEffect(() => {
    if (reducedMotion) {
      setStates(RESUME_BLOCKS.map(() => "rendered"));
      return;
    }
    cancelledRef.current = false;

    let frame = 0;
    const startedAt = performance.now();
    const blockStartTimes = RESUME_BLOCKS.map((_, i) => i * BLOCK_STAGGER_MS);

    const tick = () => {
      if (cancelledRef.current) return;
      const now = performance.now();
      const elapsed = now - startedAt;

      const nextStates: BlockState[] = [];
      const nextChars: number[] = [];
      let allDone = true;

      RESUME_BLOCKS.forEach((block, i) => {
        const start = blockStartTimes[i];
        const typingEnd = start + BLOCK_TYPING_MS;
        const renderEnd = typingEnd + COMMIT_MS;
        if (elapsed < start) {
          nextStates.push("pending");
          nextChars.push(0);
          allDone = false;
        } else if (elapsed < typingEnd) {
          nextStates.push("typing");
          nextChars.push(
            Math.floor(((elapsed - start) / BLOCK_TYPING_MS) * block.latex.length),
          );
          allDone = false;
        } else if (elapsed < renderEnd) {
          nextStates.push("typing"); // still in crossfade window
          nextChars.push(block.latex.length);
          allDone = false;
        } else {
          nextStates.push("rendered");
          nextChars.push(block.latex.length);
        }
      });

      setStates(nextStates);
      setTypedChars(nextChars);

      if (!allDone) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelledRef.current = true;
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  const skip = useCallback(() => {
    cancelledRef.current = true;
    setStates(RESUME_BLOCKS.map(() => "rendered"));
    setTypedChars(RESUME_BLOCKS.map((b) => b.latex.length));
  }, []);
  // Skip the typing animation when the visitor presses any key
  useEffect(() => {
    const onKey = () => skip();
    window.addEventListener("keydown", onKey, { once: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  const pdfHref = selectedRole?.pdf ?? "/resume/Aryan-Shukla-Resume.pdf";
  const jpgHref = selectedRole?.jpg ?? "/resume/Aryan-Shukla-Resume.jpg";

  return (
    <div className="min-h-screen w-full pt-20 pb-24 bg-[#f5f1ea] text-[#2a2520]">
      {/* Floating download cluster (top-right) */}
      <div
        className="fixed right-4 top-20 z-30 flex flex-col gap-2"
        aria-label="Download resume"
      >
        <a
          href={pdfHref}
          download
          aria-label="Download PDF"
          title="Download PDF"
          className="group flex items-center gap-1.5 rounded-full border border-[#2a2520]/20 bg-[#fbf6e9]/85 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#2a2520]/85 shadow-sm backdrop-blur transition-colors hover:bg-[#2a2520] hover:text-[#fbf6e9]"
        >
          <FileText size={12} weight="regular" />
          PDF
        </a>
        <a
          href={jpgHref}
          download
          aria-label="Download JPEG"
          title="Download JPEG"
          className="group flex items-center gap-1.5 rounded-full border border-[#2a2520]/20 bg-[#fbf6e9]/85 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#2a2520]/85 shadow-sm backdrop-blur transition-colors hover:bg-[#2a2520] hover:text-[#fbf6e9]"
        >
          <ImageIcon size={12} weight="regular" />
          JPEG
        </a>
      </div>

      {/* document */}
      <div
        className="max-w-3xl mx-auto mt-5 px-5 sm:px-12 py-8 sm:py-10 bg-white shadow-[0_2px_24px_rgba(0,0,0,0.08)] border border-[#2a2520]/10"
        style={{
          fontFamily: FONT_STACK,
          fontSize: "clamp(9.5pt, 2.6vw, 10.5pt)",
          lineHeight: 1.4,
          color: "#1a1612",
        }}
      >
        {RESUME_BLOCKS.map((block, i) => (
          <InPlaceBlock
            key={i}
            block={block}
            state={states[i]}
            typedChars={typedChars[i]}
            reducedMotion={!!reducedMotion}
          />
        ))}
      </div>

      <ResumeRoleBubble
        onSelect={setSelectedRole}
        selectedId={selectedRole?.id}
      />
    </div>
  );
}

/* ── Block that morphs in place ── */
function InPlaceBlock({
  block,
  state,
  typedChars,
  reducedMotion,
}: {
  block: ResumeBlock;
  state: BlockState;
  typedChars: number;
  reducedMotion: boolean;
}) {
  if (state === "pending") {
    return <div style={{ minHeight: "1em" }} />;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state === "typing" ? (
        <motion.div
          key="latex"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -2 }}
          transition={{ duration: 0.18 }}
          className="font-mono text-[11px] text-[#7a6248] whitespace-pre-wrap"
          style={{ marginTop: 2 }}
        >
          {block.latex.slice(0, typedChars)}
          <span className="inline-block w-1.5 h-3 bg-[#7a6248] align-[-1px] ml-0.5 animate-pulse" />
        </motion.div>
      ) : (
        <motion.div
          key="rendered"
          initial={reducedMotion ? false : { opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <RenderedBlock block={block} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Final rendered representation of each block ── */
function RenderedBlock({ block }: { block: ResumeBlock }) {
  if (block.kind === "header") {
    return (
      <div className="text-center mb-3">
        <div style={{ fontSize: "1.9em", fontWeight: 700, letterSpacing: "0.01em" }}>
          Aryan Shukla
        </div>
        <div style={{ fontSize: "0.92em", marginTop: 2 }}>
          +91 73395 79835 &nbsp;·&nbsp;{" "}
          <a href="mailto:aryanworks@hotmail.com" className="underline">
            aryanworks@hotmail.com
          </a>{" "}
          &nbsp;·&nbsp;{" "}
          <a href="https://linkedin.com/in/aryanworks" className="underline">
            linkedin.com/in/aryanworks
          </a>{" "}
          &nbsp;·&nbsp;{" "}
          <a href="https://github.com/aryan-astra" className="underline">
            github.com/aryan-astra
          </a>
        </div>
      </div>
    );
  }
  if (block.kind === "section") {
    return (
      <div className="mt-3 mb-1">
        <div
          style={{
            fontWeight: 700,
            fontSize: "0.92em",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {block.title}
        </div>
        <hr style={{ border: 0, borderTop: "0.5px solid #1a1612", margin: "1px 0 4px" }} />
      </div>
    );
  }
  if (block.kind === "education") {
    return (
      <div>
        <div className="flex flex-wrap justify-between gap-x-3">
          <span>
            <strong>SRM Institute of Science and Technology</strong>, Chennai
          </span>
          <span className="italic">Expected June 2028</span>
        </div>
        <div>Bachelor of Technology, Computer Science and Engineering</div>
      </div>
    );
  }
  if (block.kind === "project") {
    return (
      <div className="mt-1.5">
        <div className="flex flex-wrap justify-between gap-x-3">
          <strong>{block.name}</strong>
          <span style={{ fontSize: "0.92em" }}>{block.meta}</span>
        </div>
        <div className="italic" style={{ fontSize: "0.92em", marginTop: -1 }}>
          {block.tech}
        </div>
        <ul style={{ paddingLeft: "1.35em", margin: "2px 0 0" }}>
          {block.bullets.map((b, i) => (
            <li key={i} style={{ listStyle: "disc", marginTop: 1 }}>
              {b}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (block.kind === "hackathon") {
    return (
      <div className="mt-1">
        <div className="flex flex-wrap justify-between gap-x-3">
          <strong>{block.title}</strong>
          <span className="italic" style={{ fontSize: "0.92em" }}>
            {block.date}
          </span>
        </div>
        <div>{block.body}</div>
      </div>
    );
  }
  if (block.kind === "cert") {
    return (
      <div>
        <div className="flex flex-wrap justify-between gap-x-3">
          <span>
            <strong>NPTEL Elite</strong> — Programming in Java, IIT Kharagpur
          </span>
          <span className="italic">Jul–Oct 2025</span>
        </div>
        <div style={{ fontSize: "0.92em" }}>
          Score: 85% (Assignments: 24.72/25 &nbsp;|&nbsp; Proctored Exam: 60/75)
          &nbsp;·&nbsp; ID: NPTEL25CS110S459701277
        </div>
      </div>
    );
  }
  if (block.kind === "skills") {
    const rows: [string, string][] = [
      ["Languages", "Python, TypeScript, JavaScript, Kotlin, Java, C/C++"],
      [
        "AI & ML",
        "MLOps, Agentic Systems, LLM Integration, scikit-learn, Random Forest, TF-IDF, Ollama, OpenAI API, Anthropic API, LangChain",
      ],
      [
        "Frontend",
        "React, Next.js, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Jetpack Compose, PWA, Chrome Extension API",
      ],
      [
        "Backend & Infra",
        "FastAPI, Node.js, Express, Redis, Docker, GitHub Actions, CI/CD, Cloudflare Pages, Netlify, Fly.io",
      ],
      ["Databases", "MySQL, PostgreSQL"],
      ["Tools", "Git, FFmpeg, Linux, SSH, Android Studio"],
    ];
    return (
      <div className="mt-0.5">
        {rows.map(([k, v]) => (
          <div key={k} style={{ marginTop: 1.5 }}>
            <strong>{k}:</strong> {v}
          </div>
        ))}
      </div>
    );
  }
  return null;
}
