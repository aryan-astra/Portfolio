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

function ProjectCard({ project }: { project: Project }) {
  return (
    <MagneticGlowCard className="h-full">
      <article className="flex flex-col gap-3 p-5 h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-card-foreground">{project.name}</h3>
          <StatusBadge status={project.status} />
        </div>

        {/* Description */}
        <div className="flex-1">
          <p className="text-[0.97rem] leading-relaxed text-muted-foreground">{project.oneLiner}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted px-2 py-0.5 rounded-sm"
            >
              <span className="font-mono text-[0.65rem] text-muted-foreground">{tag}</span>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-3">
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
  const allProjects = [
    ...projects.filter((p) => p.status !== "archived"),
    ...projects.filter((p) => p.status === "archived"),
  ];

  return (
    <section id="projects" className="section-block">
      <div className="content-shell">
        <motion.div
          variants={fadeUp}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10"
        >
          <p className="mb-2 font-mono text-[0.68rem] tracking-[0.22em] text-muted-foreground">ALL PROJECTS</p>
          <h2 className="max-w-[16ch] font-serif text-[clamp(2.05rem,4vw,3.2rem)] leading-[1.02] tracking-[-0.01em] text-foreground">
            Things I&apos;ve shipped.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-4">
          {allProjects.map((project, index) => (
            <motion.div
              key={project.name}
              variants={fadeUp}
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.07,
              }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
