"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { posts } from "@/lib/data";
import ScatterField from "@/components/ScatterField";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Writing() {
  return (
    <section id="writing" className="section-block">
      <ScatterField variant="writing" />
      <div className="content-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6"
        >
          <p className="section-label">Writing</p>
          <h2 className="mt-3 max-w-[16ch] font-serif text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.02] text-foreground">
            Thinking out loud.
          </h2>
        </motion.div>

        <div className="grid gap-px border border-border">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.07 }}
            >
              <Link
                href={`/writing/${post.slug}`}
                className="group flex items-start justify-between gap-6 bg-card px-5 py-5 transition-colors hover:bg-[#161616]"
                aria-label={post.title}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8 flex-1 min-w-0">
                  <p className="shrink-0 font-mono text-[0.65rem] text-muted-foreground sm:w-24 sm:pt-[0.2rem]">
                    {formatDate(post.date)}
                  </p>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 text-base font-semibold text-foreground transition-colors duration-200 group-hover:text-highlight">
                      {post.title}
                    </h3>
                    <p className="max-w-[62ch] text-[0.95rem] leading-relaxed text-muted-foreground">
                      {post.description}
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="mt-1 shrink-0 text-muted-foreground transition-colors group-hover:text-highlight" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
