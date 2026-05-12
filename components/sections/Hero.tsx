"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { contact } from "@/lib/data";
import DotEyes from "@/components/DotEyes";
import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  ArrowDown,
} from "@phosphor-icons/react";

/* ── Terminal commands ── */
const COMMANDS: Record<string, string> = {
  help:     "Commands: whoami · stack · projects · contact · clear · source",
  whoami:   "Aryan Shukla — CS sophomore @ SRMIST. Building tools that get used.",
  stack:    "TypeScript · React · Next.js · Python · Kotlin · C++23 · Ollama · Redis",
  projects: "Arch SRM (300+ DAU) · VOCO · MaxQ · Monosect · Modus · Ratify",
  contact:  "aryanworks@hotmail.com · github.com/aryan-astra · linkedin.com/in/aryanworks",
  source:   "https://github.com/aryan-astra",
  clear:    "__CLEAR__",
};

/* ── Apple-style character reveal animation ── */
function useAppleReveal(text: string, trigger: boolean) {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    if (!trigger) { setRevealed(0); return; }
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= text.length) clearInterval(iv);
    }, 45);
    return () => clearInterval(iv);
  }, [trigger, text]);
  return text.slice(0, revealed);
}

/* ── Scrambled-decode name reveal ──
 * Each character cycles through random glyphs and then "locks" in sequence.
 * Adds a subtle accent dot that tracks the leading edge of the decode. */
const SCRAMBLE_GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ$#%&@!?*/+=<>"; // no O/I for legibility
function DecodedName({
  text,
  reducedMotion,
}: { text: string; reducedMotion: boolean | null }) {
  const [display, setDisplay] = useState<string>(() =>
    reducedMotion ? text : text.replace(/\S/g, () => randGlyph()),
  );
  const [activeIdx, setActiveIdx] = useState(reducedMotion ? text.length : 0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      setActiveIdx(text.length);
      return;
    }
    const start = performance.now();
    const total = 900;            // ms total reveal
    const perChar = total / text.length;
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const lockedUpTo = Math.min(text.length, Math.floor(elapsed / perChar));
      setActiveIdx(lockedUpTo);
      const next = text
        .split("")
        .map((ch, i) => {
          if (i < lockedUpTo) return ch;
          if (ch === " " || ch === "\u00a0") return ch;
          return randGlyph();
        })
        .join("");
      setDisplay(next);
      if (lockedUpTo < text.length) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, reducedMotion]);

  return (
    <span aria-label={text} className="inline-block relative">
      {display.split("").map((ch, i) => {
        const locked = i < activeIdx;
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: "inline-block",
              opacity: locked ? 1 : 0.55,
              color: !locked && ch !== " " && ch !== "\u00a0" ? "var(--accent, currentColor)" : undefined,
              transition: "opacity 90ms linear, color 90ms linear",
            }}
          >
            {ch === " " ? "\u00a0" : ch}
          </span>
        );
      })}
    </span>
  );
}
function randGlyph() {
  return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
}


export default function Hero() {
  const reducedMotion = useReducedMotion();

  /* State */
  const [cursorHovered, setCursorHovered] = useState(false);
  const [typed, setTyped] = useState("");
  const [terminalLines, setTerminalLines] = useState<
    { text: string; isCmd?: boolean }[]
  >([]);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [eyesCanvasRect, setEyesCanvasRect] = useState<DOMRect | null>(null);

  const inputRef          = useRef<HTMLInputElement>(null);
  const terminalEndRef    = useRef<HTMLDivElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const eyesFloatRef      = useRef<HTMLDivElement>(null);
  const typePrompt = useAppleReveal("type anything", cursorHovered && !isTypingActive);

  /* Mouse tracking */
  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* Measure the float container so DotEyes can track cursor */
  useEffect(() => {
    const measure = () => {
      if (eyesFloatRef.current)
        setEyesCanvasRect(eyesFloatRef.current.getBoundingClientRect());
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* Keydown — activate terminal mode */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key === "Escape") return;
      if (!isTypingActive && !cursorHovered) return;
      if (!isTypingActive) {
        setIsTypingActive(true);
        setTimeout(() => inputRef.current?.focus(), 50);
        return;
      }
    },
    [isTypingActive, cursorHovered]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* Submit terminal command */
  const submitCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === "clear") {
      setTerminalLines([]);
      setTyped("");
      return;
    }
    const response = COMMANDS[trimmed] ?? `command not found: "${trimmed}" — try "help"`;
    setTerminalLines((prev) => [
      { text: `> ${cmd}`, isCmd: true },
      { text: response },
      ...prev,
    ]);
    setTyped("");
  }, []);

  /* Scroll terminal container to bottom (not the page) */
  useEffect(() => {
    const el = terminalScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [terminalLines]);

  return (
    <section
      className="relative overflow-hidden"
      aria-label="Introduction"
    >
      <div className="w-full max-w-6xl mx-auto px-6 lg:px-14 pt-20 pb-12">

        {/*
          ── Runaround text block ─────────────────────────────────────────
          DotEyes is floated right inside the text container.
          CSS shape-outside: ellipse makes the name + bio wrap around it
          like a classic magazine runaround.
          The float div MUST appear before the text in DOM order.
        */}
        <motion.div
          className="flow-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          {/* ── Float: DotEyes ── */}
          <div
            ref={eyesFloatRef}
            className="hidden sm:block"
            style={{
              float: "right",
              shapeOutside: "ellipse(50% 46% at 50% 50%)",
              shapeMargin: "clamp(0.75rem, 2.5vw, 2rem)",
              width: "clamp(150px, 18vw, 220px)",
              marginLeft: "clamp(0.5rem, 2vw, 1.5rem)",
              marginBottom: "0.25rem",
            }}
          >
            <DotEyes
              mouseX={mousePos?.x ?? 0}
              mouseY={mousePos?.y ?? 0}
              canvasRect={eyesCanvasRect}
            />
          </div>

          {/* ── Name — scrambled-decode reveal (skip pet tilt: text is React-managed) ── */}
          <motion.h1
            data-no-tilt
            className="font-display font-black leading-none tracking-tight text-foreground"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", lineHeight: 0.9 }}
            aria-label="Aryan Shukla"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <DecodedName text={"Aryan\u00a0Shukla"} reducedMotion={reducedMotion} />
          </motion.h1>

          {/* ── Bio — wraps around the float on wide screens ── */}
          <motion.p
            className="mt-3 text-muted-foreground leading-relaxed"
            style={{ fontSize: "clamp(1rem, 1.7vw, 1.2rem)" }}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            CS sophomore at SRMIST. I build tools people actually use — real session auth
            replacing broken university portals, local LLM inference that runs offline,
            matrix ops at 40× baseline. Some of it breaks on deployment.
            Most of it ships and stays shipped.
          </motion.p>

          <div style={{ clear: "both" }} />
        </motion.div>

        {/* ── Social links ── */}
        <motion.div
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.85 }}
        >
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <EnvelopeSimple size={14} weight="regular" /> email
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <GithubLogo size={14} weight="regular" /> github
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <LinkedinLogo size={14} weight="regular" /> linkedin
          </a>
          <a
            href="/#projects"
            className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-accent transition-colors sm:ml-auto"
          >
            <ArrowDown size={14} weight="regular" /> work
          </a>
        </motion.div>

        {/* ── Terminal zone ── */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          {/* Output lines — capped height, scrolls internally */}
          <AnimatePresence>
            {terminalLines.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div
                  ref={terminalScrollRef}
                  className="mb-2 font-mono text-xs space-y-0.5 max-h-32 overflow-y-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  {[...terminalLines].reverse().map((line, i) => (
                    <div
                      key={i}
                      className={line.isCmd ? "text-accent" : "text-muted-foreground"}
                    >
                      {line.text}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input / cursor row — padded for larger hover target */}
          <div
            className="relative inline-flex items-center px-3 py-2 -mx-3 rounded-md"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => { if (!isTypingActive) setCursorHovered(false); }}
            onClick={() => {
              if (!isTypingActive) {
                setIsTypingActive(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }
            }}
            style={{ cursor: isTypingActive ? "text" : "pointer", minHeight: "2rem", minWidth: "8rem" }}
          >
            <AnimatePresence mode="wait">
              {isTypingActive ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 font-mono text-sm"
                >
                  <span className="text-accent">›</span>
                  <span className="text-foreground">{typed}</span>
                  <span
                    className="inline-block w-px h-4 bg-accent"
                    style={{ animation: "blink 1s step-end infinite" }}
                  />
                  <input
                    ref={inputRef}
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        submitCommand(typed);
                      }
                    }}
                    className="absolute opacity-0 pointer-events-none w-0 h-0"
                    aria-label="Terminal input"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </motion.div>
              ) : cursorHovered ? (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-xs text-muted-foreground tracking-wide"
                >
                  {typePrompt}
                  <span
                    className="inline-block w-px h-3 bg-accent align-middle ml-0.5"
                    style={{ animation: "blink 1s step-end infinite" }}
                  />
                </motion.div>
              ) : (
                <motion.span
                  key="cursor"
                  className="inline-block w-0.5 h-6 bg-accent"
                  style={{ animation: "blink 1s step-end infinite" }}
                  aria-label="Interactive terminal — hover to type"
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

