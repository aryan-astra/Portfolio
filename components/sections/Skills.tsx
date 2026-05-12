"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/data";

const tones = ["text-highlight", "text-foreground/60", "text-foreground/60", "text-foreground/60", "text-foreground/60"];

export default function Skills() {
  return (
    <section id="skills" className="section-block">
      <div className="content-shell">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="section-label">stack</p>
            <h2 className="section-title">Tools, but with context.</h2>
          </div>
          <p className="hidden max-w-[38ch] text-sm leading-relaxed text-muted-foreground lg:block">
            A stack list is only useful when it hints at judgment. These are the pieces I keep reaching for when the shape of the product matters.
          </p>
        </div>

        <div className="grid border border-border bg-card/70 md:grid-cols-5">
          {Object.entries(skills).map(([category, items], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.36, delay: index * 0.05 }}
              className="border-b border-border p-4 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <p className={`mono-label mb-5 ${tones[index % tones.length]}`}>{category}</p>
              <ul className="space-y-3">
                {items.map((skill) => (
                  <li key={skill} className="flex items-start gap-2 text-sm leading-snug text-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-highlight" aria-hidden="true" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
