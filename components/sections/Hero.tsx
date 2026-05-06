import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const trans = (delay: number) => ({
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  delay,
});

const SUPPORT_TEXT =
  "I'm Aryan. I build systems, interfaces, and offline tools with real users. Sometimes they work. Sometimes they break. Both are useful.";

const HINT_LINES = [
  '> type "help" to explore',
  '> type "open arch-srm"',
  "> blue cursor means live mode",
];

const INITIAL_ART = [
  "ARYAN.SHUKLA :: LIVE TERMINAL",
  "SYSTEM MODE: interactive",
  "STATUS: waiting for first command",
  " ",
  "type help to get started",
];

const ART_LINE_COLORS = [
  "text-foreground",
  "text-muted-foreground",
  "text-muted-foreground",
  "text-muted-foreground",
  "text-accent-blue",
];

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

type EyeDirection = { x: -1 | 0 | 1; y: -1 | 0 | 1 };

const positionFromOffset = (offset: number): -1 | 0 | 1 => {
  if (offset < -0.25) return -1;
  if (offset > 0.25) return 1;
  return 0;
};

const buildEye = (direction: EyeDirection, blink: boolean) => {
  if (blink) return " --- ";

  const cols = [".", ".", "."];
  const rowTone = direction.y === -1 ? "^" : direction.y === 1 ? "_" : "o";
  cols[direction.x + 1] = rowTone;
  return ` ${cols.join("")} `;
};

export default function Hero() {
  const [reducedMotion, setReducedMotion] = useState(false);

  // Terminal State
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ input: string; output: string | ReactNode; id: number }[]>([]);
  const [artLines, setArtLines] = useState(INITIAL_ART);
  const [phase, setPhase] = useState<"idle" | "erasing" | "eyes">("idle");
  const [eyeDirection, setEyeDirection] = useState<EyeDirection>({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      // Don't focus if typing in another input or if it's a modifier key
      if (
        document.activeElement?.tagName === "INPUT" || 
        document.activeElement?.tagName === "TEXTAREA" ||
        e.metaKey || e.ctrlKey || e.altKey
      ) return;

      inputRef.current?.focus();
    };
    window.addEventListener("keydown", handleGlobalKeydown);
    return () => window.removeEventListener("keydown", handleGlobalKeydown);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, artLines, phase]);

  useEffect(() => {
    if (phase !== "eyes") return;

    const timer = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 120);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "eyes") return;

    const handleMove = (event: MouseEvent) => {
      const panel = terminalRef.current;
      if (!panel) return;

      const rect = panel.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (event.clientX - centerX) / (rect.width / 2 || 1);
      const dy = (event.clientY - centerY) / (rect.height / 2 || 1);

      setEyeDirection({
        x: positionFromOffset(dx),
        y: positionFromOffset(dy),
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [phase]);

  const eyeArt = useMemo(() => {
    const eye = buildEye(eyeDirection, blink);
    return [
      "      .---------------------------.",
      "      |      system awake         |",
      `      |   [${eye}] [${eye}]   |`,
      "      |   move cursor: eyes track |",
      "      '---------------------------'",
    ];
  }, [blink, eyeDirection]);

  const handleCommand = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || phase === "erasing") return;

    const typed = input.trim();
    if (typed === "") return;

    setInput("");

    // Command logic
    let outputStr = `command not found: ${typed}`;
    if (typed.toLowerCase() === "help") {
      outputStr = "Available commands:\nhelp\nwhoami\nclear\nls\nopen <project-slug>";
    } else if (typed.toLowerCase() === "whoami") {
      outputStr = "aryan shukla - builder";
    } else if (typed.toLowerCase() === "clear") {
      setHistory([]);
      return;
    } else if (typed.toLowerCase() === "ls") {
      outputStr = "projects/  skills/  writing/  resume.pdf";
    } else if (typed.toLowerCase().startsWith("open ")) {
      outputStr = `opening ${typed.slice(5).trim()}...`;
    }

    setHistory((prev) => [...prev, { input: typed, output: outputStr, id: Date.now() }]);

    // Trigger erase animation if this is the first command
    if (phase === "idle") {
      setPhase("erasing");
      const currentLines = [...INITIAL_ART];
      for (let i = 0; i < INITIAL_ART.length; i++) {
        await sleep(80);
        currentLines.pop();
        setArtLines([...currentLines]);
      }
      setPhase("eyes");
    }
  };

  const scrollToFeatured = () => {
    document.getElementById("featured")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <section className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden" id="hero" aria-label="Hero">
      <div className="content-shell relative z-10 grid min-h-[calc(100svh-3.5rem)] grid-cols-1 xl:grid-cols-2 items-center gap-10 xl:gap-16 py-[clamp(1.75rem,7vh,4.5rem)]">
        
        {/* Left Column - Copy */}
        <div className="flex flex-col justify-center max-w-[45rem]">
          <motion.h1
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={trans(0.12)}
            className="max-w-[14ch] font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] tracking-[-0.02em] text-foreground"
          >
            I build things that people actually use.
          </motion.h1>

          <motion.p
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={trans(0.22)}
            className="mt-7 max-w-[37rem] text-[1.04rem] leading-[1.8] text-muted-foreground"
          >
            {SUPPORT_TEXT}
          </motion.p>

          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={trans(0.34)}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={scrollToFeatured}
              className="inline-flex items-center gap-2 rounded-sm bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity duration-200 hover:opacity-80"
            >
              View my work →
            </button>
            <a
              href="https://github.com/aryan-astra"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-transparent border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
            >
              GitHub <ExternalLink size={14} aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        {/* Right Column - Terminal / Eyes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="w-full h-full min-h-[400px] flex flex-col relative"
        >
          <div 
            className="flex-1 overflow-y-auto rounded-lg border border-border bg-card/40 p-6 font-mono text-xs text-muted-foreground flex flex-col gap-4 custom-scrollbar"
            ref={terminalRef}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Visual Header / Art Area */}
            <div className="flex justify-center items-center min-h-[220px] relative">
              {phase !== "eyes" ? (
                <div className="w-full max-w-[28rem] font-mono text-[11px] sm:text-xs leading-relaxed">
                  <AnimatePresence mode="popLayout">
                    {artLines.map((line, idx) => (
                      <motion.div
                        key={`${line}-${idx}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={ART_LINE_COLORS[idx] ?? "text-accent-blue"}
                      >
                        {line || "\u00A0"}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="w-full max-w-[28rem] font-mono text-[11px] sm:text-xs leading-relaxed">
                  {eyeArt.map((line, idx) => (
                    <div key={`${line}-${idx}`} className="text-foreground">
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hint Lines */}
            <div className="text-[12px] leading-[1.6]">
              {HINT_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            {/* History */}
            <div className="flex flex-col gap-3">
              {history.map((cmd) => (
                <div key={cmd.id}>
                  <div className="flex items-start gap-2 break-all text-muted-foreground">
                    <span className="shrink-0 text-accent-blue">aryan@portfolio:~$</span>
                    <span className="text-foreground">{cmd.input}</span>
                  </div>
                  {cmd.output && (
                    <div className="mt-1 leading-relaxed text-muted-foreground">
                      {typeof cmd.output === "string" ? (
                        cmd.output.split("\n").map((line, idx, all) => (
                          <motion.div
                            key={`${cmd.id}-${idx}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: (all.length - idx - 1) * 0.06 }}
                            className="whitespace-pre-wrap"
                          >
                            {line}
                          </motion.div>
                        ))
                      ) : (
                        cmd.output
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Line */}
            <div className="mt-auto flex items-center gap-2 pt-1">
              <span className="shrink-0 text-accent-blue">aryan@portfolio:~$</span>
              <div className="relative flex flex-1 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleCommand}
                  className="z-10 w-full border-none bg-transparent font-mono text-[12px] text-foreground outline-none sm:text-[13px]"
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                  disabled={phase === "erasing"}
                  style={{ caretColor: "transparent" }}
                />
                {input === "" && (
                  <span className="pointer-events-none absolute left-0 text-[#2563EB] cursor-blink">▮</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
