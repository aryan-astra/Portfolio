"use client";

import { motion } from "framer-motion";
import { projects, type Project } from "@/lib/data";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function StatusBadge({ status }: { status: Project["status"] }) {
  if (status === "active") return null;

  if (status === "shipped") {
    return (
      <span className="font-mono text-xs border border-border text-foreground px-2 py-0.5 rounded-sm">
        Shipped
      </span>
    );
  }

  return (
    <span className="font-mono text-xs text-muted-foreground px-2 py-0.5 rounded-sm border border-border/50">
      Archived
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col gap-4 p-6 border border-border hover:border-foreground transition-colors duration-200 bg-card rounded-xl">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-sans text-lg font-semibold tracking-tight text-card-foreground">
          {project.name}
        </h3>
        <StatusBadge status={project.status} />
      </div>

      {/* Description */}
      <p className="font-sans text-base text-muted-foreground leading-relaxed flex-1">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      {(project.github || project.live) && (
        <div className="flex items-center gap-4 pt-1">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors duration-200"
            >
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors duration-200"
            >
              Live ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const sorted = [
    ...projects.filter((p) => p.status !== "archived"),
    ...projects.filter((p) => p.status === "archived"),
  ];

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-foreground mb-3">
            Work
          </h2>
          <p className="font-sans text-base text-muted-foreground leading-relaxed">
            Things I&apos;ve built and shipped.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {sorted.map((project, index) => (
            <motion.div
              key={project.name}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
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
