import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="work-section content-shell">
      <div className="editorial-heading"><p className="eyebrow">01 / Selected work</p><h2>Made to be <em>used.</em></h2><p>A few things from my workbench.<br />Built, broken, and built again.</p></div>
      <div className="featured-projects">
        {projects.filter(project => project.featured).map((project, index) => (
          <Link prefetch={false} href={`/projects/${project.slug}`} key={project.slug} className={`featured-project project-${project.slug}`}>
            <div className="project-visual" aria-hidden>
              {project.slug === "arch-srm" ? <div className="arch-sketch"><div className="sketch-top">arch<span>your campus, untangled.</span></div><div className="sketch-body"><span>MONDAY / DAY 1</span><strong>One less thing<br />to worry about.</strong><div className="sketch-bars"><i /><i /><i /><i /></div><div className="sketch-cells"><span>attendance<br /><b>on track ↗</b></span><span>timetable<br /><b>all in one place</b></span></div></div></div> : <div className="voco-sketch"><span>voco / local agent</span><div className="voco-mark">v<span>o</span>co<span className="voco-asterisk">✳</span></div><code>› your machine. your model.<br /><span>everything stays here.</span><br /><br />$ ollama run qwen3:4b<br /><span>ready when you are _</span></code></div>}
              <span className="visual-index">0{index + 1} / INTERFACE STUDY</span>
            </div>
            <div className="project-caption"><div><p className="eyebrow">{project.tags.slice(0, 3).join(" / ")}</p><h3>{project.name}</h3></div><ArrowUpRight size={25} aria-hidden /></div>
            <p className="project-description">{project.description.split(". ")[0]}.</p>
          </Link>
        ))}
      </div>
      <div className="project-index-heading"><p className="eyebrow">Also on the workbench</p><span className="eyebrow">{String(projects.length).padStart(2, "0")} projects in the index</span></div>
      <div className="project-index">{projects.filter(project => !project.featured && !project.secondary).map((project, index) => <Link prefetch={false} href={`/projects/${project.slug}`} key={project.slug}><span className="eyebrow">0{index + 3}</span><h3>{project.name}</h3><p>{project.oneLiner}</p><ArrowUpRight size={20} aria-hidden /></Link>)}</div>
      <details className="side-quests"><summary>Side quests <span>{projects.filter(project => project.secondary).length} more projects +</span></summary><div>{projects.filter(project => project.secondary).map(project => <Link prefetch={false} href={`/projects/${project.slug}`} key={project.slug}><h3>{project.name} ↗</h3><p>{project.oneLiner}</p></Link>)}</div></details>
    </section>
  );
}
