"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Contact() {
  return (
    <section id="contact" className="py-32 md:py-40">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-foreground mb-4">
            Let&apos;s talk.
          </h2>
          <p className="font-sans text-base text-muted-foreground leading-relaxed mb-12">
            I&apos;m always open to interesting problems.
          </p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10"
        >
          <a
            href="mailto:ryanxastra@gmail.com"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors duration-200"
          >
            ryanxastra@gmail.com
            <ExternalLink size={12} aria-hidden="true" />
          </a>

          <a
            href="https://github.com/aryan-astra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors duration-200"
          >
            github.com/aryan-astra
            <span aria-hidden="true">↗</span>
          </a>

          <span className="font-mono text-sm text-muted-foreground">
            SRMIST, Chennai
          </span>
        </motion.div>
      </div>
    </section>
  );
}
