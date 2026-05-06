import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data";

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
    return {
      title: "Project not found",
    };
  }

  return {
    title: `${project.name} Case Study`,
    description: project.oneLiner,
  };
}

export default async function ProjectCaseStudyPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="section-block">
      <div className="content-shell">
        <div className="max-w-[70rem]">
        <Link
          href="/#projects"
          className="font-mono text-xs text-muted-foreground hover:text-accent-blue transition-colors"
        >
          ← Back to projects
        </Link>

        <header className="mt-6 mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-blue mb-2">
            Case Study
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight mb-3">
            {project.name}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">{project.oneLiner}</p>
        </header>

        <div className="space-y-10">
          <section>
            <h2 className="font-sans text-xl font-semibold text-foreground mb-3">Problem</h2>
            <p className="text-muted-foreground leading-relaxed">{project.caseStudy.problem}</p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-foreground mb-3">Approach</h2>
            <p className="text-muted-foreground leading-relaxed">{project.caseStudy.approach}</p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-foreground mb-3">Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.caseStudy.stack.map((item) => (
                <span
                  key={item}
                  className="font-mono text-xs bg-muted text-muted-foreground px-2 py-1 rounded-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-foreground mb-3">Key Decisions</h2>
            <ul className="space-y-3">
              {project.caseStudy.keyDecisions.map((decision) => (
                <li key={decision} className="text-muted-foreground leading-relaxed">
                  <span className="text-accent-blue mr-2">•</span>
                  {decision}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-foreground mb-3">Outcome</h2>
            <p className="text-muted-foreground leading-relaxed">{project.caseStudy.outcome}</p>
            {project.impact && <p className="mt-3 text-accent-blue font-medium text-sm">{project.impact}</p>}
          </section>
        </div>

        <footer className="mt-12 flex flex-wrap gap-4 pt-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-accent-blue transition-colors"
            >
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-accent-blue transition-colors"
            >
              Live ↗
            </a>
          )}
        </footer>
        </div>
      </div>
    </article>
  );
}
