import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Writing — Aryan Shukla",
  description: "Thoughts on building, shipping, and learning.",
};

export default function WritingIndex() {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="min-h-screen py-[clamp(2rem,8vw,5rem)] px-4">
      <div className="content-shell max-w-2xl">
        <div className="mb-12">
          <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-tight text-foreground mb-3">
            Writing
          </h1>
          <p className="text-muted-foreground text-lg">
            Thoughts on building, shipping, and learning.
          </p>
        </div>

        <div className="space-y-8">
          {sortedPosts.map((post) => (
            <article key={post.slug} className="pb-8 border-b border-border last:border-b-0">
              <Link href={`/writing/${post.slug}`} className="group">
                <h2 className="font-serif text-2xl text-foreground group-hover:text-accent-blue transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                  {post.description}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
