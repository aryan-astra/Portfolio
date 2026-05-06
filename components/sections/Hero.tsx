"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
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

const HELP_TEXT = `Available commands:
  help              - show this message
  whoami            - display user info
  ls                - list projects
  open <slug>       - open a project
  stack             - view tech stack
  cat resume        - open resume
  hack              - hackathon history
  blog              - view blog
  contact           - contact info
  matrix            - retro effect
  rm -rf /          - joke
  sudo              - sudo pls
  git log           - commit log
  clear             - clear terminal`;

export default function Hero() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Array<{ cmd: string; out: string; id: number }>>([]);
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
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    setInput("");

    let out = `command not found: ${cmd}`;

    if (cmd === "help") {
      out = HELP_TEXT;
    } else if (cmd === "whoami") {
      out = "aryan shukla\nbuilder, pwas, ai agents, tools\ncse @ srmist";
    } else if (cmd === "clear") {
      setHistory([]);
      return;
    } else if (cmd === "ls") {
      out = "arch-srm/  voco/  maxq/  monosect/  modus/  ratify/  img-market/";
    } else if (cmd.startsWith("open ")) {
      const slug = cmd.slice(5).trim();
      router.push(`/projects/${slug}`);
      out = `→ opening /projects/${slug}`;
    } else if (cmd === "stack") {
      out = "typescript nextjs tailwind react framer-motion\nphosphor-icons vercel node firebase";
    } else if (cmd === "cat resume") {
      window.open("/resume.pdf");
      out = "→ opening resume...";
    } else if (cmd === "hack") {
      out = "hackathon history:\n2024-10: voco (100+ users)\n2024-08: arch-srm (48h build)";
    } else if (cmd === "blog") {
      router.push("/writing");
      out = "→ opening blog...";
    } else if (cmd === "contact") {
      out = "email: aryan@aryans.is-a.dev\ngithub: aryan-astra\ntwitter: @aryans_ideas";
    } else if (cmd === "matrix") {
      setMatrixActive(true);
      out = "initiating...";
      setTimeout(() => setMatrixActive(false), 2000);
    } else if (cmd === "rm -rf /") {
      out = "rm: Permission denied (root filesystem protected)";
    } else if (cmd === "sudo") {
      out = "aryan is not in the sudoers file. This incident will be reported.";
    } else if (cmd === "git log") {
      out = "2988f34 - feat(cursor): butterfly.so glowing cursor trail\n76a1c8d - feat: phase 0 setup complete\nmore commits...";
    }

    setHistory((prev) => [...prev, { cmd: input.trim(), out, id: Date.now() }]);
  };

  const scrollToFeatured = () => {
    document.getElementById("featured")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden" id="hero">
      <div className="content-shell relative z-10 grid min-h-[calc(100svh-3.5rem)] grid-cols-1 md:grid-cols-[1fr_1fr] items-center gap-10 md:gap-12 py-[clamp(1.75rem,7vh,4.5rem)]">
        {/* Left: Intro */}
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
            CSE student at SRMIST. I build PWAs, Android apps, offline AI agents, and tools that get used daily.
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
              GitHub <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </div>

        {/* Right: Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full h-full min-h-[500px] flex flex-col"
        >
          {/* Terminal Box */}
          <div className="relative flex-1 border border-border rounded-lg bg-background/30 backdrop-blur-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="border-b border-border px-4 py-3 flex items-center gap-2 bg-background/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="ml-2 text-[11px] font-mono text-muted-foreground">aryan@portfolio:~</span>
            </div>

            {/* Content */}
            <div
              ref={terminalRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-xs text-muted-foreground space-y-2 custom-scrollbar"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="text-accent-blue">
                Type <span className="text-foreground">"help"</span> to explore · Terminal is live
              </div>

              {history.map((entry) => (
                <div key={entry.id}>
                  <div className="flex items-start gap-2">
                    <span className="text-accent-blue shrink-0">$</span>
                    <span className="text-foreground">{entry.cmd}</span>
                  </div>
                  <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {entry.out}
                  </div>
                </div>
              ))}

              {/* Active input */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-accent-blue shrink-0">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleCommand}
                  placeholder=""
                  className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground/40 w-full"
                  autoFocus
                  spellCheck="false"
                />
                {!input && <span className="text-accent-blue/50 animate-pulse">_</span>}
              </div>
            </div>
          </div>

          {/* Matrix effect (overlay) */}
          {matrixActive && (
            <div className="absolute inset-0 border border-highlight rounded-lg pointer-events-none">
              <div className="inset-0 absolute animate-pulse" style={{ background: "rgba(37, 99, 235, 0.15)" }} />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
