"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import { projects } from "@/lib/data";

const featured = projects.filter((project) => project.featured);

export default function FeaturedWork() {
  if (featured.length === 0) return null;

  return (
    <section id="featured" className="section-block">
      <div className="content-shell">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="section-label">featured work</p>
            <h2 className="section-title">Two things that escaped localhost.</h2>
          </div>
          <p className="hidden max-w-[38ch] text-sm leading-relaxed text-muted-foreground lg:block">
            Real users, real constraints, production failures and rough edges that taught me where the system was honest.
          </p>
        </div>

        <div className="grid gap-px bg-border lg:grid-cols-2">
          {featured.map((project, index) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="group relative grid grid-rows-[auto_1fr_auto] gap-6 bg-card p-6 transition-colors hover:bg-secondary"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mono-label mb-3 text-highlight">{project.impact ?? project.status}</p>
                  <h3 className="font-serif leading-none text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                    {project.name}
                  </h3>
                </div>
                <span className="font-mono text-[0.65rem] text-muted-foreground">0{index + 1}</span>
              </div>

              {/* Body */}
              <div>
                <p className="text-[0.95rem] leading-relaxed text-muted-foreground">{project.oneLiner}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="border border-border px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer links */}
              <div className="flex flex-wrap items-center gap-5 border-t border-border pt-4">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-highlight hover:text-foreground transition-colors"
                >
                  case study <ArrowUpRight size={13} />
                </Link>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <GithubLogo size={13} /> source
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    live <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
