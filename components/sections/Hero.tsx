"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const trans = (delay: number) => ({
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  delay,
});

const HELP_LINES = [
  "Available commands:",
  "help              show this message",
  "whoami            display user info",
  "ls                list projects",
  "open <slug>       open a project",
  "stack             view tech stack",
  "cat resume        open resume",
  "hack              hackathon history",
  "blog              view blog",
  "contact           contact info",
  "matrix            retro effect",
  "rm -rf /          joke",
  "sudo              sudo pls",
  "git log           commit log",
  "clear             clear stage",
];

const FIGURE_LINES = [
  "              #########             #########              ",
  "          ####         ####     ####         ####         ",
  "       ###                 ### ###                 ###     ",
  "      ##                     #####                     ##   ",
  "     ##                       ###                       ##  ",
  "    ##            #######     ###     #######            ## ",
  "    ##         ####     ####   ###   ####     ####        ## ",
  "     ##      ###             ## # ##             ###     ##  ",
  "      ##    ###                ###                ###    ##  ",
  "       ##      #######         ###         #######      ##   ",
  "        ###              ####   ###   ####              ###  ",
  "          ####          ##  ##  ###  ##  ##          ####    ",
  "              ###########    ## ### ##    ###########        ",
  "                  ##          #######          ##            ",
  "               ######       ###  ###  ###       ######       ",
  "            ####         ####   ## ##   ####         ####    ",
  "         ####        ####      #######      ####        #### ",
];

type Signal = {
  id: number;
  command: string;
  output: string[];
  erodes: string[];
  tone: "highlight" | "foreground";
};

const figureCells = FIGURE_LINES.flatMap((line, row) =>
  line.split("").map((char, col) => ({
    id: `${row}-${col}`,
    char,
    row,
    col,
  })),
).filter((cell) => cell.char !== " ");

const erosionOrder = [...figureCells].sort((a, b) => {
  const rowDelta = a.row - b.row;
  if (rowDelta !== 0) return rowDelta;
  const center = FIGURE_LINES[0].length / 2;
  const aDistance = Math.abs(a.col - center);
  const bDistance = Math.abs(b.col - center);
  return aDistance - bDistance;
});

const commandOutput = (command: string) => {
  switch (command) {
    case "help":
      return HELP_LINES;
    case "whoami":
      return ["aryan shukla", "builder, pwas, ai agents, tools", "cse @ srmist"];
    case "ls":
      return ["arch-srm/  voco/  maxq/  monosect/", "modus/  ratify/  img-market/"];
    case "stack":
      return ["typescript nextjs tailwind react framer-motion", "phosphor-icons vercel node firebase"];
    case "cat resume":
      return ["opening resume..."];
    case "hack":
      return ["hackathon history:", "2024-10: voco (100+ users)", "2024-08: arch-srm (48h build)"];
    case "blog":
      return ["opening blog..."];
    case "contact":
      return ["email: aryan@aryans.is-a.dev", "github: aryan-astra", "twitter: @aryans_ideas"];
    case "matrix":
      return ["initiating...", "signal field warming up"];
    case "rm -rf /":
      return ["rm: Permission denied (root filesystem protected)"];
    case "sudo":
      return ["aryan is not in the sudoers file. This incident will be reported."];
    case "git log":
      return ["2988f34 - feat(cursor): butterfly.so glowing cursor trail", "76a1c8d - feat: phase 0 setup complete", "more commits..."];
    default:
      return [`command not found: ${command}`];
  }
};

const erosionForCommand = (command: string) => {
  if (command === "clear") return 0;
  if (command === "help") return 12;
  if (command === "whoami") return 8;
  if (command.startsWith("open ")) return 10;
  if (command === "matrix") return 14;
  return 7;
};

const launchDelay = 820;

function SignalBurst({ signal }: { signal: Signal }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: 0, scale: 0.95 }}
      animate={{ opacity: [0, 1, 1, 0], y: [-4, -68, -160, -220], x: [0, -10, -2, 6], scale: [0.95, 1, 1.02, 0.98] }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="absolute left-1/2 top-[78%] z-20 w-[min(28rem,88%)] -translate-x-1/2 pointer-events-none"
    >
      <div className="rounded-[1.1rem] border border-border bg-background/85 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-sm">
        <div className="mb-2 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-accent-blue">
          <span className="inline-block h-2 w-2 rounded-full bg-accent-blue" />
          output
        </div>
        <div className="space-y-1 font-mono text-[0.72rem] leading-relaxed text-foreground">
          <div className="text-accent-blue">$ {signal.command}</div>
          {signal.output.map((line) => (
            <div key={line} className={signal.tone === "highlight" ? "text-foreground" : "text-muted-foreground"}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const launchTimerRef = useRef<number[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Array<{ cmd: string; out: string[]; id: number }>>([]);
  const [erasedCells, setErasedCells] = useState<Set<string>>(new Set());
  const [signals, setSignals] = useState<Signal[]>([]);
  const [matrixActive, setMatrixActive] = useState(false);

  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      )
        return;
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", handleGlobalKeydown);
    return () => window.removeEventListener("keydown", handleGlobalKeydown);
  }, []);

  useEffect(() => {
    return () => {
      launchTimerRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const figure = useMemo(() => {
    return FIGURE_LINES.map((line, row) =>
      line.split("").map((char, col) => {
        const id = `${row}-${col}`;
        return {
          id,
          char,
          hidden: erasedCells.has(id) && char !== " ",
        };
      }),
    );
  }, [erasedCells]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    setInput("");
    const output = commandOutput(cmd);
    const erodes = cmd === "clear" ? [] : erosionOrder.slice(0, erosionForCommand(cmd)).map((cell) => cell.id);

    setHistory((prev) => [...prev, { cmd: input.trim(), out: output, id: Date.now() }]);

    if (cmd === "clear") {
      setSignals([]);
      setErasedCells(new Set());
      return;
    }

    if (cmd.startsWith("open ")) {
      const slug = cmd.slice(5).trim();
      router.push(`/projects/${slug}`);
    } else if (cmd === "cat resume") {
      window.open("/resume.pdf");
    } else if (cmd === "blog") {
      router.push("/writing");
    } else if (cmd === "matrix") {
      setMatrixActive(true);
      const timer = window.setTimeout(() => setMatrixActive(false), 2000);
      launchTimerRef.current.push(timer);
    }

    const signalId = Date.now();
    setSignals((prev) => [
      ...prev,
      {
        id: signalId,
        command: input.trim(),
        output,
        erodes,
        tone: cmd === "help" || cmd === "matrix" ? "highlight" : "foreground",
      },
    ]);

    const timer = window.setTimeout(() => {
      setErasedCells((prev) => {
        const next = new Set(prev);
        erodes.forEach((cellId) => next.add(cellId));
        return next;
      });
      setSignals((prev) => prev.filter((signal) => signal.id !== signalId));
    }, launchDelay);
    launchTimerRef.current.push(timer);
  };

  const scrollToFeatured = () => {
    document.getElementById("featured")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden" id="hero">
      <div className="content-shell relative z-10 grid min-h-[calc(100svh-3.5rem)] grid-cols-1 gap-12 py-[clamp(1.75rem,7vh,4.5rem)] md:grid-cols-[0.95fr_1.05fr] md:items-center">
        <div className="flex max-w-[46rem] flex-col justify-center">
          <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={trans(0.08)} className="mb-5 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-highlight" />
            live systems / kinetic portfolio
          </motion.div>

          <motion.h1
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={trans(0.12)}
            className="max-w-[10ch] font-serif text-[clamp(3.3rem,8vw,6.8rem)] leading-[0.88] tracking-[-0.05em] text-foreground"
          >
            I build interfaces that move back.
          </motion.h1>

          <motion.p
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={trans(0.22)}
            className="mt-7 max-w-[40rem] text-[1.02rem] leading-[1.9] text-muted-foreground md:text-[1.08rem]"
          >
            CSE student at SRMIST. I design systems, apps, and agents that feel alive when you touch them, then keep working when you look closer.
          </motion.p>

          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={trans(0.34)}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={scrollToFeatured}
              className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform duration-200 hover:-translate-y-0.5"
            >
              View my work
              <ArrowUpRight size={14} />
            </button>
            <a
              href="https://github.com/aryan-astra"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm font-medium text-foreground transition-transform duration-200 hover:-translate-y-0.5 hover:bg-muted"
            >
              GitHub
              <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[34rem]"
        >
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(26,24,22,0.08),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0.12))] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" />
          <div className="relative h-full overflow-hidden rounded-[2rem] border border-border/70 bg-background/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm md:p-7" onClick={() => inputRef.current?.focus()}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-highlight" />
                signal stage
              </div>
              <div className="font-mono text-[0.65rem] tracking-[0.22em] text-muted-foreground">click / type / launch</div>
            </div>

            <div className="relative min-h-[22rem] overflow-hidden rounded-[1.5rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0.08))] p-4 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))]">
              <motion.div
                aria-hidden
                animate={matrixActive ? { opacity: [0.18, 0.45, 0.18], scale: [1, 1.015, 1] } : { opacity: 0.18, scale: 1 }}
                transition={{ duration: 1.4, repeat: matrixActive ? Infinity : 0, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.12),transparent_52%)]"
              />

              <div className="relative mx-auto flex max-w-[34rem] flex-col items-center gap-4 pt-2">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-muted-foreground"
                >
                  ascii corrector
                </motion.div>

                <div className="w-full overflow-hidden rounded-[1.2rem] border border-border/60 bg-background/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                  <div className="space-y-[0.12rem] text-center font-mono text-[0.63rem] leading-[1] tracking-[0.06em] md:text-[0.72rem]">
                    {figure.map((row, rowIndex) => (
                      <div key={rowIndex} className="whitespace-pre">
                        {row.map((cell) => (
                          <motion.span
                            key={cell.id}
                            animate={cell.hidden ? { opacity: 0, y: -2, filter: "blur(2px)" } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.32, ease: "easeOut" }}
                            className={cell.char === "#" ? "text-foreground" : "text-accent-blue"}
                          >
                            {cell.hidden ? " " : cell.char}
                          </motion.span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid w-full gap-2 text-center md:grid-cols-3">
                  {[
                    "cursor launches from the blue block",
                    "outputs travel up and eat the figure",
                    "the figure collapses command by command",
                  ].map((line) => (
                    <div key={line} className="rounded-full border border-border bg-background/75 px-3 py-2 font-mono text-[0.68rem] text-muted-foreground">
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {signals.map((signal) => (
                  <SignalBurst key={signal.id} signal={signal} />
                ))}
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <div className="rounded-[1.15rem] border-2 border-highlight bg-background px-4 py-3 shadow-[0_0_0_1px_rgba(37,99,235,0.08),0_18px_50px_rgba(37,99,235,0.08)]">
                  <div className="flex items-center gap-3 font-mono text-[0.72rem] text-foreground md:text-[0.8rem]">
                    <span className="shrink-0 text-highlight">&gt;</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleCommand}
                      className="w-full border-none bg-transparent outline-none placeholder:text-muted-foreground/45"
                      placeholder="click here, type a command, press enter"
                      spellCheck={false}
                      autoComplete="off"
                      aria-label="Command input"
                    />
                    <span className="inline-flex h-5 w-3 items-center justify-center rounded-[0.2rem] bg-highlight/85 shadow-[0_0_18px_rgba(37,99,235,0.3)] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {history.slice(-3).map((entry) => (
                <div key={entry.id} className="rounded-full border border-border bg-background/70 px-3 py-2 font-mono text-[0.65rem] text-muted-foreground">
                  <span className="text-highlight">$</span> {entry.cmd}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
