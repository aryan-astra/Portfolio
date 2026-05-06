"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { projects, type Project } from "@/lib/data";
import MagneticGlowCard from "@/components/MagneticGlowCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function StatusBadge({ status }: { status: Project["status"] }) {
  if (status === "active") return null;

  const label = status === "shipped" ? "shipped" : "archived";

  return (
    <span className="px-2 py-0.5 rounded-sm border border-border/40">
      <span className="font-mono text-[0.65rem] text-muted-foreground/60">{label}</span>
    </span>
  );
}

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <MagneticGlowCard className="h-full">
      <article className={`flex flex-col gap-4 h-full ${featured ? "p-6" : "p-5"}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className={`font-semibold text-card-foreground ${featured ? "text-lg" : "text-base"}`}>{project.name}</h3>
          <StatusBadge status={project.status} />
        </div>

        {/* Description */}
        <div className="flex-1">
          <p className={`leading-relaxed text-muted-foreground ${featured ? "text-base" : "text-[0.97rem]"}`}>
            {project.oneLiner}
          </p>
          {featured && project.description && (
            <p className="text-sm text-muted-foreground/80 mt-3">{project.description}</p>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-muted px-2 py-0.5 rounded-sm">
              <span className="font-mono text-[0.65rem] text-muted-foreground">{tag}</span>
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 pt-2">
          <Link
            href={`/projects/${project.slug}`}
            className="font-mono text-xs text-accent-blue hover:opacity-70 transition-opacity duration-200"
            aria-label={`Read ${project.name} case study`}
          >
            Case Study →
          </Link>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-accent-blue transition-colors duration-200"
              aria-label={`View ${project.name} on GitHub`}
            >
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-accent-blue transition-colors duration-200"
              aria-label={`View ${project.name} live`}
            >
              Live ↗
            </a>
          )}
        </div>
      </article>
    </MagneticGlowCard>
  );
}

export default function Projects() {
  const featuredProjects = projects.filter((p) => p.featured);
  const mainProjects = projects.filter((p) => !p.featured && !p.secondary);
  const secondaryProjects = projects.filter((p) => p.secondary);

  return (
    <section id="featured" className="section-block">
      <div className="content-shell">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12"
        >
          <p className="mb-2 font-mono text-[0.68rem] tracking-[0.22em] text-muted-foreground">PROJECTS</p>
          <h2 className="max-w-[16ch] font-serif text-[clamp(2.05rem,4vw,3.2rem)] leading-[1.02] tracking-[-0.01em] text-foreground">
            Things I&apos;ve shipped.
          </h2>
        </motion.div>

        {/* FEATURED: Full width, stacked */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <motion.h3
              initial={fadeUp.hidden}
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-mono text-[0.75rem] tracking-[0.15em] text-muted-foreground mb-4 uppercase"
            >
              Featured
            </motion.h3>
            <div className="space-y-4">
              {featuredProjects.map((project, idx) => (
                <motion.div
                  key={project.slug}
                  variants={fadeUp}
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <ProjectCard project={project} featured />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN: Grid */}
        {mainProjects.length > 0 && (
          <div className="mb-16">
            <motion.h3
              initial={fadeUp.hidden}
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-mono text-[0.75rem] tracking-[0.15em] text-muted-foreground mb-4 uppercase"
            >
              Main Projects
            </motion.h3>
            <div className="grid md:grid-cols-2 gap-4">
              {mainProjects.map((project, idx) => (
                <motion.div
                  key={project.slug}
                  variants={fadeUp}
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* SECONDARY: Compact list */}
        {secondaryProjects.length > 0 && (
          <div>
            <motion.h3
              initial={fadeUp.hidden}
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-mono text-[0.75rem] tracking-[0.15em] text-muted-foreground mb-4 uppercase"
            >
              Other Projects
            </motion.h3>
            <motion.div
              initial={fadeUp.hidden}
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.1 }}
              className="space-y-2 pl-4 border-l border-border"
            >
              {secondaryProjects.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`} className="block group">
                  <div className="flex items-start justify-between gap-4 py-2 -ml-4 pl-4 hover:bg-muted/30 transition-colors rounded-sm">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground group-hover:text-accent-blue transition-colors">
                        {project.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">{project.oneLiner}</p>
                    </div>
                    <span className="shrink-0 text-muted-foreground group-hover:text-accent-blue transition-colors">→</span>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
