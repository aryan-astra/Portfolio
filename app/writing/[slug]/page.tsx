import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/lib/data";

type WritingPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.description,
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function WritingPostPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) notFound();

  return (
    <article className="section-block">
      <div className="content-shell">
        <Link href="/writing" className="site-link mono-label inline-flex transition-colors">
          Back to writing
        </Link>

        <header className="mt-8 border-y border-border py-8">
          <p className="section-label">note / {formatDate(post.date)}</p>
          <h1 className="max-w-[12ch] font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.88] tracking-normal text-foreground">
            {post.title}
          </h1>
          <p className="mt-5 max-w-[52rem] text-[clamp(1rem,2vw,1.18rem)] leading-relaxed text-muted-foreground">{post.description}</p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.42fr_0.9fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 border border-border bg-card/70 p-4">
              <p className="mono-label text-highlight">reading log</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{post.body.length} short sections, written from shipped work instead of theory.</p>
            </div>
          </aside>

          <div className="max-w-[78ch] space-y-7">
            {post.body.map((paragraph, index) => (
              <p key={`${post.slug}-${index}`} className="text-[1.05rem] leading-[1.9] text-muted-foreground">
                <span className="mr-4 align-top font-mono text-[0.7rem] text-highlight">{String(index + 1).padStart(2, "0")}</span>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
