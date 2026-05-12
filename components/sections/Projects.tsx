"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, CaretDown } from "@phosphor-icons/react";
import { projects } from "@/lib/data";
import ScatterField from "@/components/ScatterField";

const mainProjects = projects.filter((project) => !project.featured && !project.secondary);
const secondaryProjects = projects.filter((project) => project.secondary);

export default function Projects() {
  const [secondaryOpen, setSecondaryOpen] = useState(false);

  return (
    <section id="projects" className="section-block">
      <ScatterField variant="projects" />
      <div className="content-shell">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="section-label">project index</p>
            <h2 className="section-title">A bench of smaller experiments.</h2>
          </div>
          <p className="hidden max-w-[38ch] text-sm leading-relaxed text-muted-foreground lg:block">
            Smaller surfaces, shipped experiments, and half-answered questions that might become larger systems later.
          </p>
        </div>

        <div className="border-t border-border">
          {mainProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.38, delay: index * 0.05 }}
            >
              <Link href={`/projects/${project.slug}`} className="group grid gap-4 border-b border-border py-5 transition-colors hover:bg-[#161616] md:grid-cols-[0.16fr_0.9fr_1.2fr_0.5fr] md:items-center md:px-3">
                <span className="font-mono text-[0.7rem] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-serif text-[clamp(1.7rem,3vw,2.6rem)] leading-none text-foreground transition-colors group-hover:text-highlight">
                  {project.name}
                </span>
                <span className="max-w-[60ch] text-[0.98rem] leading-relaxed text-muted-foreground">{project.oneLiner}</span>
                <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors group-hover:text-highlight md:justify-self-end">
                  {project.status}
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {secondaryProjects.length > 0 && (
          <div className="mt-8 border border-border bg-card/70">
            <button
              type="button"
              onClick={() => setSecondaryOpen((value) => !value)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
              aria-expanded={secondaryOpen}
            >
              <span>
                <span className="mono-label block text-highlight">side quests</span>
                <span className="mt-1 block text-sm text-muted-foreground">{secondaryProjects.length} compact project{secondaryProjects.length === 1 ? "" : "s"}</span>
              </span>
              <CaretDown className={`text-highlight transition-transform ${secondaryOpen ? "rotate-180" : ""}`} size={18} />
            </button>

            {secondaryOpen && (
              <div className="border-t border-border">
                {secondaryProjects.map((project) => (
                  <Link key={project.slug} href={`/projects/${project.slug}`} className="group flex items-start justify-between gap-4 border-b border-border px-4 py-4 last:border-b-0 hover:bg-[#161616]">
                    <span>
                      <span className="block font-medium text-foreground transition-colors group-hover:text-highlight">{project.name}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{project.oneLiner}</span>
                    </span>
                    <ArrowUpRight size={14} className="mt-1 shrink-0 text-muted-foreground transition-colors group-hover:text-highlight" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
