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

        <header className="mt-5 border-y border-border py-5">
          <p className="section-label">note / {formatDate(post.date)}</p>
          <h1 className="max-w-[12ch] font-serif text-[clamp(2rem,5vw,4rem)] leading-[0.9] tracking-normal text-foreground">
            {post.title}
          </h1>
          <p className="mt-5 max-w-[52rem] text-[clamp(1rem,2vw,1.18rem)] leading-relaxed text-muted-foreground">{post.description}</p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.42fr_0.9fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mono-label text-highlight mb-3">sections</p>
              <nav aria-label="Article sections">
                {post.body.map((paragraph, index) => {
                  const sectionId = `section-${String(index + 1).padStart(2, "0")}`;
                  const preview = paragraph.split(" ").slice(0, 6).join(" ");
                  return (
                    <a
                      key={sectionId}
                      href={`#${sectionId}`}
                      className="group flex items-start gap-2 py-1.5 border-l-2 border-transparent hover:border-accent pl-2.5 transition-colors"
                    >
                      <span className="shrink-0 font-mono text-[0.62rem] text-highlight mt-px">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[0.62rem] leading-snug text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                        {preview}&hellip;
                      </span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="max-w-[78ch] space-y-7">
            {post.body.map((paragraph, index) => {
              const sectionId = `section-${String(index + 1).padStart(2, "0")}`;
              const tocLabel = `${String(index + 1).padStart(2, "00")} · ${paragraph.split(" ").slice(0, 6).join(" ")}\u2026`;
              return (
                <section
                  id={sectionId}
                  key={`${post.slug}-${index}`}
                  aria-label={`Section ${index + 1}`}
                  data-toc-label={tocLabel}
                  className="scroll-mt-20"
                >
                  <p className="text-[1.05rem] leading-[1.9] text-muted-foreground">
                    <span className="mr-4 align-top font-mono text-[0.7rem] text-highlight">{String(index + 1).padStart(2, "0")}</span>
                    {paragraph}
                  </p>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
