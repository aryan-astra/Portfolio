"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { projects } from "@/lib/data";
import MagneticGlowCard from "@/components/MagneticGlowCard";

const featured = projects.filter((p) => p.featured);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FeaturedWork() {
  if (featured.length === 0) return null;

  return (
    <section id="featured" className="section-block">
      <div className="content-shell">
        <motion.div
          variants={fadeUp}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10"
        >
          <p className="mb-2 font-mono text-[0.68rem] tracking-[0.22em] text-accent-blue">FEATURED WORK</p>
          <h2 className="max-w-[16ch] font-serif text-[clamp(2.05rem,4vw,3.2rem)] leading-[1.02] tracking-[-0.01em] text-foreground">
            Proof of work.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-5">
          {featured.map((project, i) => (
            <motion.div
              key={project.name}
              variants={fadeUp}
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
            >
              <MagneticGlowCard className="h-full">
                <article className="flex flex-col gap-4 p-6 h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-card-foreground">{project.name}</h3>
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center text-muted-foreground group-hover:text-accent-blue transition-colors duration-200">
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </div>

                  {/* Impact line */}
                  {project.impact && (
                    <p className="text-sm font-medium text-accent-blue">{project.impact}</p>
                  )}

                  {/* Description */}
                  <div className="flex-1">
                    <p className="text-[0.98rem] leading-relaxed text-muted-foreground">{project.oneLiner}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted px-2 py-0.5 rounded-sm"
                      >
                        <span className="font-mono text-[0.65rem] text-muted-foreground">{tag}</span>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-1">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
