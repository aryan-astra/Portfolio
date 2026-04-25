"use client";

import { motion } from "framer-motion";
import { hackathons } from "@/lib/data";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Hackathons() {
  const sorted = [...hackathons].sort((a, b) => b.year - a.year);

  return (
    <section id="hackathons" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-foreground mb-3">
            Hackathons
          </h2>
          <p className="font-sans text-base text-muted-foreground leading-relaxed">
            5 events. Learnt something at every one.
          </p>
        </motion.div>

        <div className="flex flex-col">
          {sorted.map((entry, index) => (
            <motion.div
              key={`${entry.event}-${index}`}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.08,
              }}
              className="flex flex-row items-stretch"
            >
              {/* Year */}
              <div className="font-mono text-xs text-muted-foreground w-12 shrink-0 pt-1">
                {entry.year}
              </div>

              {/* Vertical line */}
              <div className="w-px bg-border self-stretch mx-4 shrink-0" />

              {/* Content */}
              <div className="flex-1 pb-10 last:pb-0">
                <p className="font-sans text-sm font-semibold text-foreground mb-0.5">
                  {entry.event}
                </p>
                <p className="font-serif text-lg text-foreground mb-2">
                  {entry.project}
                </p>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-3">
                  {entry.description}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {entry.team && (
                    <span className="font-mono text-xs text-muted-foreground">
                      Team: {entry.team}
                    </span>
                  )}
                  {entry.result === "Qualified further rounds" ? (
                    <span className="font-mono text-xs border border-border text-foreground px-2 py-0.5 rounded-sm">
                      {entry.result}
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-muted-foreground">
                      {entry.result}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
