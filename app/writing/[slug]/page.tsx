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

  if (!post) {
    return {
      title: "Post not found",
    };
  }

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

  if (!post) {
    notFound();
  }

  return (
    <article className="section-block">
      <div className="content-shell">
        <div className="max-w-3xl">
        <Link
          href="/writing"
          className="font-mono text-xs text-muted-foreground hover:text-accent-blue transition-colors"
        >
          ← Back to writing
        </Link>

        <header className="mt-6 mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-blue mb-2">Note</p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight mb-4">{post.title}</h1>
          <p className="font-mono text-xs text-muted-foreground">{formatDate(post.date)}</p>
        </header>

        <div className="space-y-6">
          {post.body.map((paragraph, index) => (
            <p key={`${post.slug}-${index}`} className="text-base text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        </div>
      </div>
    </article>
  );
}
