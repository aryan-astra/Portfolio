"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/data";
import MagneticGlowCard from "@/components/MagneticGlowCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const categoryIcons: Record<string, string> = {
  Languages: "{ }",
  Frameworks: "⬡",
  Cloud: "☁",
  Tools: "⚙",
  Concepts: "◈",
};

export default function Skills() {
  return (
    <section id="skills" className="section-block">
      <div className="content-shell">
        <motion.div
          variants={fadeUp}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10"
        >
          <p className="mb-2 font-mono text-[0.68rem] tracking-[0.22em] text-muted-foreground">STACK</p>
          <h2 className="max-w-[17ch] font-serif text-[clamp(2.05rem,4vw,3.2rem)] leading-[1.02] tracking-[-0.01em] text-foreground">
            What I actually use.
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {Object.entries(skills).map(([category, items], i) => (
            <motion.div
              key={category}
              variants={fadeUp}
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 + i * 0.06 }}
            >
              <MagneticGlowCard className="h-full p-4">
                {/* Category header */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="font-mono text-base text-muted-foreground group-hover:text-accent-blue transition-colors duration-200"
                    aria-hidden="true"
                  >
                    {categoryIcons[category] ?? "·"}
                  </span>
                  <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">{category}</p>
                </div>

                {/* Items */}
                <ul className="space-y-1.5">
                  {items.map((skill) => (
                    <li key={skill}>
                      <p className="text-sm leading-snug text-foreground">{skill}</p>
                    </li>
                  ))}
                </ul>
              </MagneticGlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
