"use client";

import { motion } from "framer-motion";
import { Envelope, GithubLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react";
import { contact } from "@/lib/data";

const links = [
  { label: contact.email, href: `mailto:${contact.email}`, icon: Envelope },
  { label: "github.com/aryan-astra", href: contact.github, icon: GithubLogo },
  { label: "x.com/aryanxastra", href: contact.twitter, icon: XLogo },
  { label: "linkedin.com/in/aryanworks", href: contact.linkedin, icon: LinkedinLogo },
];

export default function Contact() {
  return (
    <section id="contact" className="section-block pb-10">
      <div className="content-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="grid gap-8 border border-border bg-card p-5 sm:p-7 lg:grid-cols-[1fr_0.9fr] lg:items-end"
        >
          <div>
            <p className="section-label">contact</p>
            <h2 className="mt-3 max-w-[10ch] font-serif text-[clamp(1.8rem,3.5vw,3rem)] leading-[0.95] tracking-normal text-foreground">
              Bring a strange brief.
            </h2>
            <p className="mt-5 max-w-[44rem] text-[1rem] leading-relaxed text-muted-foreground">
              I like useful tools, fast prototypes, ugly production lessons, and projects with enough pressure to become specific.
            </p>
          </div>

          <div className="grid gap-2">
            {links.map(({ label, href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="group flex items-center justify-between gap-4 border border-border bg-background px-4 py-3 text-foreground transition-colors hover:border-highlight hover:bg-secondary dark:hover:bg-[#1a1a16]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Icon size={18} className="shrink-0 text-highlight" />
                  <span className="truncate text-sm text-foreground">{label}</span>
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground group-hover:text-highlight">open</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
