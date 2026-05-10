import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { posts } from "@/lib/data";

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
      <div className="content-shell">
        <div className="mb-10 grid gap-6 border-b border-border pb-8 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="section-label">writing</p>
            <h1 className="max-w-[10ch] font-serif text-[clamp(3rem,8vw,6.8rem)] leading-[0.88] tracking-normal text-foreground">
              Notes that kept the receipt.
            </h1>
          </div>
          <p className="hidden max-w-[38ch] text-sm leading-relaxed text-muted-foreground lg:block">
            Incidents, local AI, hackathons, and the parts of shipping that do not fit cleanly inside a project card.
          </p>
        </div>

        <div className="grid gap-4">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group grid gap-5 border border-border bg-card p-5 transition-colors hover:border-highlight hover:bg-[#161616] md:grid-cols-[0.18fr_1fr_0.16fr] md:items-start"
            >
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">{formatDate(post.date)}</span>
              <span>
                <span className="block font-serif text-[clamp(1.85rem,4vw,3.4rem)] leading-[0.95] text-foreground transition-colors group-hover:text-highlight">
                  {post.title}
                </span>
                <span className="mt-3 block max-w-[68ch] text-[0.98rem] leading-relaxed text-muted-foreground">{post.description}</span>
              </span>
              <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors group-hover:text-highlight md:justify-self-end">
                0{index + 1}
                <ArrowUpRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
