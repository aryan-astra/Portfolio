"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Envelope } from "@phosphor-icons/react";
import MagneticGlowCard from "@/components/MagneticGlowCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Contact() {
  return (
    <section id="contact" className="section-block">
      <div className="content-shell">
        <motion.div
          variants={fadeUp}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10"
        >
          <p className="mb-2 font-mono text-[0.68rem] tracking-[0.22em] text-muted-foreground">CONTACT</p>
          <h2 className="max-w-[16ch] font-serif text-[clamp(2.05rem,4vw,3.2rem)] leading-[1.02] tracking-[-0.01em] text-foreground">
            Let&apos;s talk.
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
          className="flex flex-col sm:flex-row flex-wrap gap-4"
        >
          <MagneticGlowCard>
            <a
              href="mailto:ryanxastra@gmail.com"
              id="contact-email"
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-sans"
            >
              <Envelope
                size={14}
                aria-hidden="true"
                className="shrink-0 text-muted-foreground group-hover:text-accent-blue transition-colors"
              />
              <span className="text-[0.97rem] text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                ryanxastra@gmail.com
              </span>
            </a>
          </MagneticGlowCard>

          <MagneticGlowCard>
            <a
              href="https://github.com/aryan-astra"
              target="_blank"
              rel="noopener noreferrer"
              id="contact-github"
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-sans"
            >
              <span className="text-[0.97rem] text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                github.com/aryan-astra
              </span>
              <ArrowUpRight size={12} aria-hidden="true" className="shrink-0 text-muted-foreground" />
            </a>
          </MagneticGlowCard>

          <MagneticGlowCard>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              id="contact-resume"
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-sans"
            >
              <ArrowUpRight
                size={14}
                aria-hidden="true"
                className="shrink-0 text-muted-foreground group-hover:text-accent-blue transition-colors"
              />
              <span className="text-[0.97rem] text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                Resume
              </span>
            </a>
          </MagneticGlowCard>
        </motion.div>

        <motion.div
          variants={fadeUp}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.22 }}
          className="mt-8"
        >
          <p className="font-mono text-[0.65rem] text-muted-foreground">// SRMIST, Chennai · India</p>
        </motion.div>
      </div>
    </section>
  );
}
