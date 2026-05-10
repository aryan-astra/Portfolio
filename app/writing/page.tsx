import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/data";
import MagneticGlowCard from "@/components/MagneticGlowCard";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on shipping, local AI, and hackathons.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function WritingIndexPage() {
  return (
    <section className="section-block">
      <div className="content-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 font-mono text-[0.68rem] tracking-[0.24em] text-muted-foreground">WRITING</p>
          <h1 className="max-w-[9ch] font-serif text-[clamp(2.8rem,6vw,5rem)] leading-[0.92] tracking-[-0.05em] text-foreground">
            Notes, not noise.
          </h1>
          <p className="mt-5 max-w-[32rem] text-[1rem] leading-relaxed text-muted-foreground">
            Small essays on the things that broke, the things that shipped, and the weird tradeoffs that made both worth doing.
          </p>
          <Link href="/" className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-accent-blue transition-opacity hover:opacity-70">
            ← Back home
          </Link>
        </div>

        <div className="grid gap-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/writing/${post.slug}`} className="block group">
              <MagneticGlowCard className="bg-card/70 border-border/55">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">{formatDate(post.date)}</div>
                    <h2 className="text-[1.05rem] font-semibold text-foreground transition-colors group-hover:text-accent-blue">
                      {post.title}
                    </h2>
                    <p className="mt-2 max-w-[60ch] text-[0.97rem] leading-relaxed text-muted-foreground">
                      {post.description}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-accent-blue">↗</span>
                </div>
              </MagneticGlowCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
