"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { posts } from "@/lib/data";
import MagneticGlowCard from "@/components/MagneticGlowCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
      <div className="content-shell">
        <motion.div
          variants={fadeUp}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10"
        >
          <p className="mb-2 font-mono text-[0.68rem] tracking-[0.22em] text-muted-foreground">WRITING</p>
          <h2 className="max-w-[16ch] font-serif text-[clamp(2.05rem,4vw,3.2rem)] leading-[1.02] tracking-[-0.01em] text-foreground">
            Thinking out loud.
          </h2>
        </motion.div>

        <div className="grid gap-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              variants={fadeUp}
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
            >
              <Link
                href={`/writing/${post.slug}`}
                className="block"
                aria-label={post.title}
              >
                <MagneticGlowCard className="bg-card/66 border-border/45">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-8 py-5 px-4 h-full">
                    <div className="shrink-0 sm:w-24 sm:pt-1">
                      <p className="font-mono text-[0.65rem] text-muted-foreground">{formatDate(post.date)}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 text-base font-semibold text-foreground group-hover:text-accent-blue transition-colors duration-200">
                        {post.title}
                      </h3>
                      <p className="max-w-[62ch] text-[0.97rem] leading-relaxed text-muted-foreground">
                        {post.description}
                      </p>
                    </div>
                    <span
                      className="hidden sm:block font-mono text-xs text-muted-foreground group-hover:text-accent-blue transition-colors duration-200 pt-1 shrink-0"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </MagneticGlowCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
