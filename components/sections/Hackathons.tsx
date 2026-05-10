"use client";

import { motion } from "framer-motion";
import { hackathons } from "@/lib/data";
import MagneticGlowCard from "@/components/MagneticGlowCard";

const sorted = [...hackathons].sort((a, b) => b.year - a.year);

function TimelineNode({ entry, index }: { entry: (typeof hackathons)[0]; index: number }) {
  const qualified = entry.result === "Qualified further rounds";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
      className="flex gap-5"
    >
      {/* Left: year + line */}
      <div className="flex flex-col items-center gap-0 shrink-0 w-12">
        <p className="pt-1 font-mono text-[0.65rem] text-muted-foreground">{entry.year}</p>
        {/* Dot */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 + index * 0.08 }}
          className={`mt-2 w-2 h-2 rounded-full shrink-0 ${qualified ? "bg-accent-blue" : "bg-border"}`}
          aria-hidden="true"
        />
        {/* Line (not shown on last item) */}
        {index < sorted.length - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.12 + index * 0.08 }}
            className="flex-1 w-px bg-border mt-1 origin-top"
          />
        )}
      </div>

      {/* Right: content */}
      <div className="pb-10 flex-1 min-w-0">
        <MagneticGlowCard>
          <div className="p-5">
            <p className="mb-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{entry.event}</p>
            <h3 className="mb-1 max-w-[22ch] font-serif text-3xl leading-tight text-foreground">{entry.project}</h3>
            <p className="mb-3 max-w-[50ch] text-[0.97rem] leading-relaxed text-muted-foreground">{entry.description}</p>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              {entry.team && (
                <p className="font-mono text-[0.65rem] text-muted-foreground">Team: {entry.team}</p>
              )}
              <span
                className={`px-2 py-0.5 rounded-sm border ${
                  qualified
                    ? "border-accent-blue"
                    : "border-border"
                }`}
              >
                <span className={`font-mono text-[0.65rem] ${qualified ? "text-accent-blue" : "text-muted-foreground"}`}>
                  {entry.result}
                </span>
              </span>
            </div>
          </div>
        </MagneticGlowCard>
      </div>
    </motion.div>
  );
}

export default function Hackathons() {
  return (
    <section id="hackathons" className="section-block">
      <div className="content-shell">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, ease: "easeOut" }} className="mb-12">
          <p className="mb-2 font-mono text-[0.68rem] tracking-[0.22em] text-muted-foreground">HACKATHONS</p>
          <h2 className="max-w-[16ch] font-serif text-[clamp(2.05rem,4vw,3.2rem)] leading-[1.02] tracking-[-0.01em] text-foreground">
            Built under pressure.
          </h2>
          <div className="mt-3">
            <p className="text-[0.97rem] text-muted-foreground">
              {sorted.length} events. Learnt something at every one.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col">
          {sorted.map((entry, i) => (
            <TimelineNode key={`${entry.event}-${i}`} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
