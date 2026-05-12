import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/lib/data";
import RevealBlock from "@/components/RevealBlock";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: `${project.name} Case Study`,
    description: project.oneLiner,
  };
}

export default async function ProjectCaseStudyPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  const sections = [
    ["Problem", project.caseStudy.problem],
    ["Approach", project.caseStudy.approach],
    ["Outcome", project.caseStudy.outcome],
  ] as const;

  return (
    <article className="section-block">
      <div className="content-shell">
        <Link href="/#projects" className="site-link mono-label inline-flex transition-colors">
          Back to projects
        </Link>

        <header className="mt-5 grid gap-8 border-y border-border py-5 lg:grid-cols-[0.9fr_0.55fr] lg:items-end">
          <div>
            <p className="section-label">case study / {project.status}</p>
            <h1 className="font-serif text-[clamp(2rem,5vw,4rem)] leading-[0.9] tracking-normal text-foreground">
              {project.name}
            </h1>
            <p className="mt-5 max-w-[48rem] text-[clamp(1rem,2vw,1.2rem)] leading-relaxed text-muted-foreground">{project.oneLiner}</p>
          </div>

          <div className="grid gap-3 border border-border bg-card/70 p-4">
            {project.impact && (
              <div>
                <p className="mono-label text-muted-foreground">impact</p>
                <p className="mt-1 text-2xl font-semibold text-highlight">{project.impact}</p>
              </div>
            )}
            <div>
              <p className="mono-label text-muted-foreground">stack</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.caseStudy.stack.map((item) => (
                  <span key={item} className="border border-border px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.62fr_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-card/70 p-4">
              <p className="mono-label mb-4 text-highlight">links</p>
              <div className="grid gap-2">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border border-border bg-background/35 px-3 py-3 text-sm text-foreground transition-colors hover:border-highlight hover:text-highlight">
                    <span className="flex items-center gap-2"><GithubLogo size={16} /> Source</span>
                    <ArrowUpRight size={14} />
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border border-border bg-background/35 px-3 py-3 text-sm text-foreground transition-colors hover:border-highlight hover:text-highlight">
                    <span>Live surface</span>
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </aside>

          <div className="grid gap-6">
            {sections.map(([title, body], i) => (
              <RevealBlock key={title} delay={i * 0.08}>
                <section className="border border-border bg-card/70 p-5">
                  <p className="mono-label mb-4 text-highlight">{title}</p>
                  <p className="max-w-[76ch] text-[1rem] leading-[1.8] text-muted-foreground">{body}</p>
                </section>
              </RevealBlock>
            ))}

            <RevealBlock delay={sections.length * 0.08}>
              <section className="border border-border bg-card/70 p-5">
                <p className="mono-label mb-4 text-highlight">Key decisions</p>
                <div className="grid gap-3">
                  {project.caseStudy.keyDecisions.map((decision, index) => (
                    <div key={decision} className="grid gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[3rem_1fr]">
                      <span className="font-mono text-sm text-muted-foreground">0{index + 1}</span>
                      <p className="leading-relaxed text-muted-foreground">{decision}</p>
                    </div>
                  ))}
                </div>
              </section>
            </RevealBlock>
          </div>
        </div>
      </div>
    </article>
  );
}
