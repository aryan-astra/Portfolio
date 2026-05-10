"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { contact } from "@/lib/data";

/* ══════════════════════════════════════════════════════════════════
   CHARACTER — 12 lines, deletion goes bottom→top (line 11 first)
══════════════════════════════════════════════════════════════════ */
const CHAR_LINES = [
  "          ╭──────────╮          ",  // 0 head top
  "         │  ◕      ◕  │         ",  // 1 eyes
  "         │      ·      │         ",  // 2 nose
  "         │  ╰──────╯  │         ",  // 3 smile
  "          ╰──────────╯          ",  // 4 head bottom
  "               ║║               ",  // 5 neck
  "               ║║               ",  // 6 torso
  "   ═══════════╬╬═══════════     ",  // 7 ARMS (animated)
  "               ║║               ",  // 8 lower torso
  "             ╱    ╲             ",  // 9 legs top
  "            ╱      ╲            ",  // 10
  "           ╱        ╲           ",  // 11
];

// Arm wave frames (swapped into CHAR_LINES[7] during ascii phase)
const ARM_FRAMES = [
  "   ═══════════╬╬═══════════     ",  // 0 neutral
  "   ════════════╬╬═════════╲     ",  // 1 right arm tilts
  "   ════════════╬╬══════════╲    ",  // 2 higher
  "   ════════════╬╬═══════════╲   ",  // 3 top
  "   ════════════╬╬════════════○  ",  // 4 hand visible
  "   ════════════╬╬═════════╲     ",  // 5 coming back
  "   ═══════════╬╬═══════════     ",  // 6 neutral
];

/* ══════════════════════════════════════════════════════════════════
   ASCII FLOWERS — fixed positions (no Math.random in render)
══════════════════════════════════════════════════════════════════ */
const FLOWER_ART = [
  ["  *  ", " *** ", "*****", " *** ", "  *  "],
  [" \\|/ ", "--*--", " /|\\ "],
  [" ,+, ", "++*++", " `+` "],
  [" (_) ", "  |  ", " /|\\ "],
  ["  ^  ", " /_\\ ", " | | "],
  ["  *  ", " *** ", "*****", " *** ", "  *  "],
  [" \\|/ ", "--*--", " /|\\ "],
  [" ,+, ", "++*++", " `+` "],
];

const FLOWER_CONFIG = [
  { x: 4,  y: 8,  fi: 0, delay: 0,   dur: 9  },
  { x: 88, y: 6,  fi: 1, delay: 2.2, dur: 11 },
  { x: 10, y: 68, fi: 2, delay: 1.1, dur: 8  },
  { x: 82, y: 72, fi: 3, delay: 3.4, dur: 10 },
  { x: 48, y: 3,  fi: 4, delay: 0.7, dur: 9  },
  { x: 2,  y: 42, fi: 5, delay: 4.8, dur: 8  },
  { x: 93, y: 48, fi: 6, delay: 1.9, dur: 11 },
  { x: 58, y: 88, fi: 7, delay: 3.1, dur: 9  },
  { x: 24, y: 85, fi: 0, delay: 5.5, dur: 10 },
  { x: 70, y: 90, fi: 1, delay: 2.8, dur: 8  },
  { x: 35, y: 55, fi: 2, delay: 6.0, dur: 12 },
  { x: 76, y: 30, fi: 3, delay: 1.5, dur: 9  },
];

/* ══════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════ */
type Phase = "ascii" | "typing" | "eye";

/* ══════════════════════════════════════════════════════════════════
   HALFTONE DOT-MATRIX EYES
   Two eyes on one canvas — dot SIZE encodes brightness (halftone).
   White dots on dark bg: large=bright (sclera), tiny=dark (pupil).
   Both pupils share one lerped offset that tracks the cursor.
══════════════════════════════════════════════════════════════════ */
function DotEye({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);
  const pupilOff  = useRef({ x: 0, y: 0 });  // shared lerped offset
  const mouse     = useRef({ x: mouseX, y: mouseY });

  // Keep mouse ref in sync without restarting the RAF loop
  useEffect(() => { mouse.current = { x: mouseX, y: mouseY }; }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 420, H = 188;
    const GAP   = 8;         // grid spacing
    const MAX_R = 3.7;       // max dot radius (fully bright sclera)
    const MAX_P = 14;        // max pupil travel (pixels)

    // Eye descriptors: cx/cy=center, ew=half-width, et=top semi-h, eb=bot semi-h,
    //                  ir=iris radius, pr=pupil radius
    const EYES = [
      { cx: 125, cy: 94,  ew: 96,  et: 39, eb: 30, ir: 42, pr: 18 },  // left
      { cx: 295, cy: 97,  ew: 88,  et: 35, eb: 27, ir: 38, pr: 16 },  // right (slightly smaller)
    ];

    /**
     * Returns brightness 0–1 at grid point (x,y) for one eye.
     * 1 = fully bright  → large white dot
     * 0 = fully dark    → no/tiny dot (dark bg shows = looks black)
     * -1 = outside eye  → skip
     */
    function getBrightness(
      x: number, y: number,
      cx: number, cy: number,
      ew: number, et: number, eb: number,
      ir: number, pr: number,
      px: number, py: number,
    ): number {
      const dx = x - cx, dy = y - cy;
      const vy   = dy < 0 ? et : eb;
      const eVal = (dx * dx) / (ew * ew) + (dy * dy) / (vy * vy);
      if (eVal > 1) return -1;

      // Distances
      const id  = Math.sqrt(dx * dx + dy * dy);          // from iris center
      const ppx = x - (cx + px), ppy = y - (cy + py);
      const pd  = Math.sqrt(ppx * ppx + ppy * ppy);      // from pupil center

      // ── PUPIL (near-black) ──
      if (pd < pr) return 0.03 + (pd / pr) * 0.09;

      // ── IRIS ──
      if (id < ir) {
        const t      = id / ir;                             // 0=center, 1=edge
        const limbal = t > 0.76 ? Math.pow((t - 0.76) / 0.24, 2) * 0.40 : 0; // limbal ring
        const ang    = Math.atan2(dy, dx);
        const fiber  = Math.sin(ang * 8) * 0.05;            // radial texture
        return Math.max(0.05, 0.44 - t * 0.08 + fiber - limbal);
      }

      // ── SCLERA ──
      const t = (id - ir) / (ew - ir);  // 0=iris edge → 1=eye edge
      let b = 0.90 - t * 0.33;

      // Top eyelid shadow (lashes/lid make top very dark)
      const sq       = Math.sqrt(Math.max(0, 1 - (dx / ew) ** 2));
      const topEdgeY = cy - et * sq;
      const fromTop  = (y - topEdgeY) / (et * 0.48);
      if (fromTop < 1) b -= (1 - Math.max(0, fromTop)) * 0.75;

      // Bottom eyelid subtle shadow
      const botEdgeY = cy + eb * sq;
      const fromBot  = (botEdgeY - y) / (eb * 0.26);
      if (fromBot < 1) b -= (1 - Math.max(0, fromBot)) * 0.28;

      // Edge vignette
      b -= Math.pow(eVal, 2.5) * 0.16;

      return Math.max(0.03, b);
    }

    const frame = () => {
      // Update shared pupil offset from live mouse ref
      const rect = canvas.getBoundingClientRect();
      const mx   = mouse.current.x - rect.left - rect.width  / 2;
      const my   = mouse.current.y - rect.top  - rect.height / 2;
      const d    = Math.min(Math.sqrt(mx * mx + my * my) * 0.06, MAX_P);
      const ang  = Math.atan2(my, mx);
      const tx   = Math.cos(ang) * d, ty = Math.sin(ang) * d;
      pupilOff.current.x += (tx - pupilOff.current.x) * 0.08;
      pupilOff.current.y += (ty - pupilOff.current.y) * 0.08;

      ctx.clearRect(0, 0, W, H);
      const { x: px, y: py } = pupilOff.current;

      // Staggered (hexagonal-ish) dot grid
      let row = 0;
      for (let gy = GAP * 0.5; gy < H; gy += GAP, row++) {
        const xOff = (row & 1) ? GAP * 0.5 : 0;
        for (let gx = GAP * 0.5 + xOff; gx < W; gx += GAP) {
          let b = -1;
          for (const e of EYES) {
            const val = getBrightness(gx, gy, e.cx, e.cy, e.ew, e.et, e.eb, e.ir, e.pr, px, py);
            if (val >= 0) { b = val; break; }
          }
          if (b < 0) continue;

          const r = Math.max(0.3, b * MAX_R);
          ctx.beginPath();
          ctx.arc(gx, gy, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,208,200,${0.55 + b * 0.45})`;
          ctx.fill();
        }
      }

      // Catchlights (bright white specular highlights in each iris)
      for (const e of EYES) {
        ctx.beginPath();
        ctx.arc(e.cx + px + 12, e.cy + py - 11, 2.1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.90)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e.cx + px - 7, e.cy + py + 7, 1.0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.38)";
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []); // Stable — all live data accessed via refs

  return (
    <canvas
      ref={canvasRef}
      width={420}
      height={188}
      style={{ width: "100%", maxWidth: 440, height: "auto" }}
      className="select-none"
      aria-label="Halftone dot-matrix eyes that follow your cursor"
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
   TERMINAL COMMAND HANDLER
══════════════════════════════════════════════════════════════════ */
function outputFor(raw: string): string[] {
  const cmd = raw.trim().toLowerCase();
  if (!cmd || cmd === "help") return ["whoami  ·  ls  ·  stack  ·  contact  ·  clear"];
  if (cmd === "whoami") return ["aryan shukla", "cse sophomore @ srmist", "300+ daily users shipped"];
  if (cmd === "ls") return ["arch-srm", "voco", "maxq", "plannet", "wander"];
  if (cmd === "stack") return ["typescript · next.js · react", "node · postgres · redis · prisma"];
  if (cmd === "contact") return [contact.email, "github.com/aryan-astra"];
  return [`unknown: ${raw}`, "type: help"];
}

/* ══════════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const reduced = useReducedMotion();

  const [phase,        setPhase]        = useState<Phase>("ascii");
  const [armFrame,     setArmFrame]     = useState(0);
  const [visibleLines, setVisibleLines] = useState(CHAR_LINES.length);
  const [mouse,        setMouse]        = useState({ x: 0, y: 0 });
  const [cmd,          setCmd]          = useState("");
  const [history,      setHistory]      = useState<{ text: string; isCmd: boolean }[]>([]);
  const [cursorHover,  setCursorHover]  = useState(false);

  const inputRef    = useRef<HTMLInputElement>(null);
  const historyRef  = useRef<HTMLDivElement>(null);
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const armInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Arm wave animation ── */
  useEffect(() => {
    if (phase !== "ascii" || reduced) return;
    armInterval.current = setInterval(() => {
      setArmFrame(f => (f + 1) % ARM_FRAMES.length);
    }, 230);
    return () => { if (armInterval.current) clearInterval(armInterval.current); };
  }, [phase, reduced]);

  /* ── Global mouse tracking ── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ── Delete character bottom → top ── */
  const startDeletion = useCallback(() => {
    if (phase !== "ascii") return;
    if (armInterval.current) clearInterval(armInterval.current);
    setPhase("typing");
    let rem = CHAR_LINES.length;
    const tick = () => {
      rem--;
      setVisibleLines(rem);
      if (rem <= 0) { setTimeout(() => setPhase("eye"), 380); return; }
      deleteTimer.current = setTimeout(tick, 100);
    };
    deleteTimer.current = setTimeout(tick, 180);
  }, [phase]);

  /* ── Any key in ascii phase triggers deletion ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (phase === "ascii" && e.key.length === 1) {
        startDeletion();
        setCmd(e.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, startDeletion]);

  /* ── Focus terminal input ── */
  useEffect(() => {
    if (phase === "typing" || phase === "eye") {
      setTimeout(() => inputRef.current?.focus(), 260);
    }
  }, [phase]);

  /* ── Auto-scroll history ── */
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  /* ── Cleanup ── */
  useEffect(() => () => {
    if (deleteTimer.current)  clearTimeout(deleteTimer.current);
    if (armInterval.current)  clearInterval(armInterval.current);
  }, []);

  /* ── Run terminal command ── */
  const runCmd = () => {
    const t = cmd.trim();
    setCmd("");
    if (!t) return;
    if (t.toLowerCase() === "clear") { setHistory([]); return; }
    setHistory(h => [
      ...h.slice(-22),
      { text: `❯ ${t}`, isCmd: true },
      ...outputFor(t).map(line => ({ text: line, isCmd: false })),
    ]);
  };

  /* ── Build visible lines with animated arm substitution ── */
  const displayLines = CHAR_LINES.slice(0, visibleLines).map((line, i) =>
    i === 7 ? ARM_FRAMES[armFrame] : line
  );

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">

      {/* ── Background: floating ASCII flowers ── */}
      {!reduced && FLOWER_CONFIG.map((fc, i) => (
        <motion.pre
          key={i}
          className="pointer-events-none absolute select-none font-mono text-[0.48rem] leading-[1.35] text-foreground/[0.06]"
          style={{ left: `${fc.x}%`, top: `${fc.y}%` }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: [0, 0.7, 0.7, 0], y: [28, 0, -12, -36] }}
          transition={{
            duration: fc.dur,
            delay: fc.delay,
            repeat: Infinity,
            repeatDelay: fc.dur * 0.9,
            ease: "easeInOut",
          }}
        >
          {FLOWER_ART[fc.fi].join("\n")}
        </motion.pre>
      ))}

      {/* ── Two-column grid: left=name, right=character ── */}
      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">

        {/* ════ LEFT — Name + Bio (order-2 on mobile so char shows first) ════ */}
        <motion.div
          className="order-2 flex flex-col justify-center px-8 py-12 lg:order-1 lg:px-16 lg:py-0"
          initial={reduced ? undefined : { opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label mb-8">portfolio · 2026</p>

          <h1
            className="font-serif text-foreground"
            style={{
              fontSize: "clamp(3.8rem, 8.5vw, 7.2rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
            }}
          >
            Aryan
            <br />
            Shukla
          </h1>

          <p className="mt-7 max-w-[34ch] text-[0.94rem] leading-relaxed text-muted-foreground">
            CSE sophomore at SRMIST. Building things that reach real users — 300+ daily actives across shipped projects.
          </p>

          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[0.67rem] uppercase tracking-[0.2em] text-muted-foreground">
            <a href={`mailto:${contact.email}`} className="transition-colors hover:text-highlight">email</a>
            <a href={contact.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-highlight">github</a>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-highlight">linkedin</a>
            <Link href="/writing" className="transition-colors hover:text-highlight">writing</Link>
            <a href="#featured" className="transition-colors hover:text-highlight">work ↓</a>
          </div>
        </motion.div>

        {/* ════ RIGHT — Character / Eye + Cursor / Terminal ════ */}
        <div className="order-1 flex flex-col items-center justify-center gap-6 px-6 py-12 lg:order-2 lg:py-0">

          {/* Character or Eye */}
          <AnimatePresence mode="wait">

            {/* ── ASCII character (ascii + typing phases) ── */}
            {(phase === "ascii" || phase === "typing") && (
              <motion.div
                key="char"
                initial={reduced ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center"
              >
                <pre
                  className="select-none font-mono leading-[1.55] text-foreground/75"
                  style={{ fontSize: "clamp(0.58rem, 1.4vw, 0.82rem)" }}
                  aria-label="ASCII art character"
                >
                  {displayLines.join("\n")}
                </pre>
              </motion.div>
            )}

            {/* ── Dot-matrix eye (eye phase) ── */}
            {phase === "eye" && (
              <motion.div
                key="eye"
                initial={reduced ? undefined : { opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[400px]"
              >
                <DotEye mouseX={mouse.x} mouseY={mouse.y} />
                <p className="mt-2 text-center font-mono text-[0.55rem] uppercase tracking-[0.22em] text-muted-foreground/50">
                  move cursor · i&apos;m watching
                </p>
              </motion.div>
            )}

          </AnimatePresence>

          {/* ── Terminal area ── */}
          <div className="w-full max-w-[22rem]">

            {/* History — each line rises from below */}
            <AnimatePresence>
              {history.length > 0 && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-2 overflow-hidden border border-border bg-card"
                >
                  <div
                    ref={historyRef}
                    className="max-h-36 overflow-y-auto p-3 font-mono text-[0.67rem] leading-[1.65]"
                  >
                    {history.map((entry, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className={entry.isCmd ? "text-highlight" : "text-muted-foreground"}
                      >
                        {entry.text}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Blue blinking cursor (ascii phase only) ── */}
            {phase === "ascii" && (
              <motion.button
                type="button"
                onClick={startDeletion}
                onHoverStart={() => setCursorHover(true)}
                onHoverEnd={() => setCursorHover(false)}
                className="group flex cursor-none items-center gap-3 outline-none"
                aria-label="Click or type to interact"
              >
                <motion.span
                  className={`inline-block bg-highlight ${cursorHover ? "" : "cursor-blink"}`}
                  animate={{ width: cursorHover ? "3rem" : "0.52rem" }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  style={{ height: "1.1rem", display: "inline-block" }}
                />
                <AnimatePresence>
                  {cursorHover && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.14 }}
                      className="font-mono text-[0.59rem] uppercase tracking-[0.24em] text-muted-foreground"
                    >
                      type something
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            {/* ── Active terminal input (typing + eye phases) ── */}
            {(phase === "typing" || phase === "eye") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.28 }}
                className="flex items-center gap-2 border-b border-highlight pb-1"
              >
                <span className="shrink-0 font-mono text-[0.75rem] text-highlight">❯</span>
                <input
                  ref={inputRef}
                  value={cmd}
                  onChange={e => setCmd(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") runCmd(); }}
                  className="flex-1 bg-transparent font-mono text-[0.75rem] text-foreground outline-none caret-highlight placeholder:text-muted-foreground/40"
                  placeholder="help"
                  autoComplete="off"
                  spellCheck={false}
                />
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
