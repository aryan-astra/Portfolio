"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/data";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-foreground mb-3">
            Stack
          </h2>
          <p className="font-sans text-base text-muted-foreground leading-relaxed mb-14">
            What I actually use.
          </p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
        >
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                {category}
              </p>
              <ul>
                {items.map((skill) => (
                  <li
                    key={skill}
                    className="text-sm font-sans text-foreground py-1 border-b border-border last:border-0"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
