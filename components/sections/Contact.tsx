"use client";

import { motion } from "framer-motion";
import { Envelope, GithubLogo, LinkedinLogo, TwitterLogo } from "@phosphor-icons/react";
import MagneticGlowCard from "@/components/MagneticGlowCard";
import { contact } from "@/lib/data";

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
          className="flex flex-col flex-wrap gap-4 sm:flex-row"
        >
          <MagneticGlowCard>
            <a
              href={`mailto:${contact.email}`}
              id="contact-email"
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-sans transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Envelope
                size={14}
                aria-hidden="true"
                className="shrink-0 text-muted-foreground transition-all duration-200 group-hover:text-accent-blue group-hover:rotate-[-8deg]"
              />
              <span className="text-[0.97rem] text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                {contact.email}
              </span>
            </a>
          </MagneticGlowCard>

          <MagneticGlowCard>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              id="contact-github"
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-sans transition-transform duration-200 hover:-translate-y-0.5"
            >
              <GithubLogo size={14} aria-hidden="true" className="shrink-0 text-muted-foreground transition-all duration-200 group-hover:text-accent-blue group-hover:-rotate-6" />
              <span className="text-[0.97rem] text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                github.com/aryan-astra
              </span>
            </a>
          </MagneticGlowCard>

          <MagneticGlowCard>
            <a
              href={contact.twitter}
              target="_blank"
              rel="noopener noreferrer"
              id="contact-twitter"
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-sans transition-transform duration-200 hover:-translate-y-0.5"
            >
              <TwitterLogo size={14} aria-hidden="true" className="shrink-0 text-muted-foreground transition-all duration-200 group-hover:text-accent-blue group-hover:-rotate-6" />
              <span className="text-[0.97rem] text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                x.com/aryanxastra
              </span>
            </a>
          </MagneticGlowCard>

          <MagneticGlowCard>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              id="contact-linkedin"
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-sans transition-transform duration-200 hover:-translate-y-0.5"
            >
              <LinkedinLogo size={14} aria-hidden="true" className="shrink-0 text-muted-foreground transition-all duration-200 group-hover:text-accent-blue group-hover:-rotate-6" />
              <span className="text-[0.97rem] text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                linkedin.com/in/aryanworks
              </span>
            </a>
          </MagneticGlowCard>

          <div className="flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-xs text-muted-foreground">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent-blue" aria-hidden="true" />
            Resume available on request
          </div>
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
