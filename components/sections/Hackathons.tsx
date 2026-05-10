"use client";

import { motion } from "framer-motion";
import { hackathons } from "@/lib/data";

const sorted = [...hackathons].sort((a, b) => b.year - a.year || a.event.localeCompare(b.event));

export default function Hackathons() {
  return (
    <section id="hackathons" className="section-block">
      <div className="content-shell">
        <div className="mb-10 grid gap-5 lg:grid-cols-[0.7fr_1fr] lg:items-end">
          <div>
            <p className="section-label">hackathons</p>
            <h2 className="section-title">Short clocks, useful scars.</h2>
          </div>
          <p className="hidden max-w-[38ch] text-sm leading-relaxed text-muted-foreground lg:block">
            Event logs instead of a trophy shelf. Some qualified, some collapsed, each one made scope and taste a little sharper.
          </p>
        </div>

        <div className="grid gap-3">
          {sorted.map((entry, index) => {
            const qualified = entry.result === "Qualified further rounds";
            return (
              <motion.article
                key={`${entry.event}-${entry.project}`}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="grid gap-4 border border-border bg-card/70 p-4 md:grid-cols-[0.16fr_0.45fr_1fr_0.32fr] md:items-start"
              >
                <div className="font-mono text-[0.72rem] text-muted-foreground">{entry.year}</div>
                <div>
                  <p className="mono-label text-muted-foreground">{entry.event}</p>
                  <h3 className="mt-2 font-serif text-2xl leading-none text-foreground">{entry.project}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{entry.description}</p>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {entry.team && <span className="border border-border px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">{entry.team}</span>}
                  <span className={`border px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] ${qualified ? "border-highlight text-highlight" : "border-border text-muted-foreground"}`}>
                    {entry.result}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
