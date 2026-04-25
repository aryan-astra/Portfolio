"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const transition = (delay: number) => ({
  duration: 0.5,
  ease: "easeOut" as const,
  delay,
});

export default function Hero() {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center py-24">
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className="max-w-2xl">
          <motion.p
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={transition(0)}
            className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6"
          >
            aryan shukla
          </motion.p>

          <motion.h1
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={transition(0.1)}
            className="font-serif text-6xl md:text-8xl leading-none text-foreground mb-8"
          >
            Builder.
            <br />
            CSE @ SRMIST.
          </motion.h1>

          <motion.p
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={transition(0.2)}
            className="font-sans text-base md:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
          >
            I build things that actually get used — from PWAs serving 300+ daily
            users to offline AI agents running on commodity hardware.
          </motion.p>

          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={transition(0.3)}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="https://github.com/aryan-astra"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-foreground text-foreground px-5 py-2.5 text-sm font-sans hover:bg-foreground hover:text-background transition-colors duration-200"
            >
              GitHub <ExternalLink size={14} />
            </a>
            <button
              onClick={scrollToProjects}
              className="inline-flex items-center gap-1.5 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              View Work <span aria-hidden="true">→</span>
            </button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={transition(0.5)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <span
          aria-hidden="true"
          className="font-mono text-sm text-muted-foreground animate-bounce inline-block"
        >
          ↓
        </span>
      </motion.div>
    </section>
  );
}
