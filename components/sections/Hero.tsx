"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { contact, heroSubtext, hackathons, posts, projects } from "@/lib/data";

const heroFade = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const COMMANDS = ["help", "whoami", "ls", "stack", "open", "cat", "hack", "blog", "contact", "clear", "matrix"];

type HistoryEntry = {
  command: string;
  output: string[];
  tone?: "default" | "accent";
};

function formatPrompt(command: string) {
  return `$ ${command}`;
}

function buildOutput(command: string) {
  switch (command) {
    case "help":
      return [
        "help                  show this message",
        "whoami                display user info",
        "ls                    list current projects",
        "stack                 show current stack",
        "open <slug>           open a project page",
        "cat resume            open resume.pdf",
        "hack                  recent hackathon history",
        "blog                  open the writing index",
        "contact               show contact links",
        "matrix                toggle the easter egg",
        "clear                 clear the terminal",
      ];
    case "whoami":
      return ["Aryan Shukla", "CSE @ SRMIST", "builder of tools, apps, and small systems that actually ship"];
    case "ls":
      return projects.map((project) => project.slug).slice(0, 7);
    case "stack":
      return ["TypeScript / Next.js / Tailwind", "Framer Motion / Phosphor Icons", "Node / browsers / small AI tooling"];
    case "cat resume":
      return ["opening /resume.pdf"];
    case "hack":
      return hackathons.map((entry) => `${entry.year}  ${entry.event}  ${entry.result}`);
    case "blog":
      return ["opening /writing"];
    case "contact":
      return [
        `email   ${contact.email}`,
        `github  github.com/aryan-astra`,
        `twitter x.com/aryanxastra`,
        `linked  linkedin.com/in/aryanworks`,
      ];
    case "matrix":
      return ["signal field warming up", "head-up display engaged"];
    default:
      return [`command not found: ${command}`];
  }
}

export default function Hero() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "help",
      output: ["type help to see the command list"],
      tone: "accent",
    },
  ]);
  const [matrixActive, setMatrixActive] = useState(false);

  const quickLinks = useMemo(
    () => [
      { label: "/projects", href: "/#projects" },
      { label: "/writing", href: "/writing" },
      { label: "/contact", href: "/#contact" },
    ],
    [],
  );

  useEffect(() => {
    const handleGlobalKeydown = (event: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      inputRef.current?.focus();
    };

    window.addEventListener("keydown", handleGlobalKeydown);
    return () => window.removeEventListener("keydown", handleGlobalKeydown);
  }, []);

  useEffect(() => {
    const node = terminalRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [history]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const submitCommand = (rawCommand: string) => {
    const command = rawCommand.trim();
    if (!command) return;

    const normalized = command.toLowerCase();
    let output = buildOutput(normalized);

    if (normalized === "clear") {
      setHistory([]);
      setInput("");
      setMatrixActive(false);
      return;
    }

    if (normalized === "matrix") {
      setMatrixActive(true);
      const timer = window.setTimeout(() => setMatrixActive(false), 2200);
      timersRef.current.push(timer);
    }

    if (normalized === "blog") {
      router.push("/writing");
    }

    if (normalized === "cat resume") {
      window.open("/resume.pdf", "_blank", "noopener,noreferrer");
    }

    if (normalized.startsWith("open ")) {
      const slug = normalized.slice(5).trim();
      const project = projects.find((item) => item.slug === slug);
      if (project) {
        router.push(`/projects/${project.slug}`);
        output = [`opening /projects/${project.slug}`];
      } else {
        output = [`unknown project: ${slug}`, "try ls to see available slugs"];
      }
    }

    setHistory((current) => [
      ...current,
      {
        command,
        output,
        tone: normalized === "help" || normalized === "matrix" ? "accent" : "default",
      },
    ]);

    setInput("");
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    submitCommand(input);
  };

  return (
    <section id="hero" className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden">
      <div className="content-shell relative z-10 grid min-h-[calc(100svh-3.5rem)] gap-10 py-[clamp(2rem,8vh,5rem)] lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={heroFade}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-w-[46rem] flex-col justify-center"
        >
          <p className="mb-4 inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent-blue" />
            busy building / ship-fast
          </p>

          <h1 className="max-w-[11ch] font-serif text-[clamp(3.35rem,8vw,6.8rem)] leading-[0.9] tracking-[-0.05em] text-foreground">
            I build things people actually use.
          </h1>

          <p className="mt-6 max-w-[36rem] text-[1.02rem] leading-[1.85] text-muted-foreground md:text-[1.08rem]">
            {heroSubtext}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-foreground transition-transform duration-200 hover:-translate-y-0.5 hover:border-accent-blue/50 hover:text-accent-blue"
              >
                {link.label}
                <ArrowUpRight size={12} aria-hidden="true" />
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2 text-[0.7rem] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <span className="rounded-full border border-border px-3 py-1">7 projects shipped</span>
            <span className="rounded-full border border-border px-3 py-1">3 essays published</span>
            <span className="rounded-full border border-border px-3 py-1">{hackathons.length} hackathons</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(37,99,235,0.07),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0.1))] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.05),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" />
          <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-background/85 shadow-[0_28px_90px_rgba(0,0,0,0.12)] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border/70 bg-[#0b0c10] px-4 py-3 text-[0.66rem] uppercase tracking-[0.22em] text-[#9ca3af]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
              </div>
              <span>terminal / aryan@portfolio</span>
              <span className={matrixActive ? "text-accent-blue" : "text-[#9ca3af]"}>{matrixActive ? "matrix" : "ready"}</span>
            </div>

            <div
              ref={terminalRef}
              className="relative max-h-[32rem] min-h-[28rem] overflow-auto bg-[#08090d] px-4 py-4 font-mono text-[0.82rem] leading-6 text-[#e5e7eb]"
              onClick={() => inputRef.current?.focus()}
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                  matrixActive
                    ? "opacity-100 bg-[radial-gradient(circle_at_50%_20%,rgba(37,99,235,0.22),transparent_45%)]"
                    : "opacity-0"
                }`}
              />

              <div className="relative space-y-4">
                {history.map((entry, index) => (
                  <motion.div
                    key={`${entry.command}-${index}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1"
                  >
                    <div className="text-accent-blue">{formatPrompt(entry.command)}</div>
                    {entry.output.map((line, lineIndex) => (
                      <div
                        key={`${entry.command}-${lineIndex}`}
                        className={entry.tone === "accent" ? "text-[#f8fafc]" : "text-[#cbd5e1]"}
                      >
                        {line}
                      </div>
                    ))}
                  </motion.div>
                ))}

                <div className="sticky bottom-0 bg-[#08090d] pt-2">
                  <label className="flex items-center gap-2 text-accent-blue">
                    <span>$</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent text-[#f8fafc] outline-none placeholder:text-[#6b7280]"
                      placeholder="help, whoami, ls, stack, open arch-srm, blog..."
                      spellCheck={false}
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                    />
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-[#6b7280]">
                    <span>help</span>
                    <span>whoami</span>
                    <span>ls</span>
                    <span>stack</span>
                    <span>open</span>
                    <span>cat resume</span>
                    <span>hack</span>
                    <span>blog</span>
                    <span>contact</span>
                    <span>clear</span>
                    <span>matrix</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
