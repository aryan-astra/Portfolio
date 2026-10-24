import type { Metadata } from "next";
import { RESUME_BLOCKS } from "@/lib/resume";
import { ruResume } from "@/lib/ru";
import { RuPageTitle } from "@/components/ru/RuShell";

const base = "https://aryans.is-a.dev";
export const metadata: Metadata = {
  title: "Резюме",
  description: "Образование, проекты, хакатоны и технические навыки Арьяна Шуклы.",
  alternates: { canonical: `${base}/ru/resume`, languages: { en: `${base}/resume`, ru: `${base}/ru/resume` } },
};

const projectNames = ["Arch — неофициальный учебный портал SRMIST", "VOCO — автономный агент для Windows", "MaxQ — музыкальный плеер Android", "Monosect — программа для разделения видео в Windows", "Modus — расширение для ИИ-платформ", "Ratify — система согласования коммитов"];
const projectTech = [
  "TypeScript · React 19 · Vite · PWA · Node.js · Express · Redis",
  "Python · Ollama · Qwen3:4b · TF-IDF · Random Forest · CLINC150 · Textual TUI",
  "Kotlin · Jetpack Compose · Media3 ExoPlayer · AGSL · MediaSession · Retrofit · DataStore",
  "C++23 · ImGui · GLFW · OpenGL · FFmpeg · GitHub Actions",
  "JavaScript · Chrome Extension API · Playwright · GitHub Actions",
  "TypeScript · Next.js · Node.js · PostgreSQL · CLI (ratify)",
];
const projectMeta = [
  "GitHub · archsrm.netlify.app · янв. 2025 — настоящее время",
  "GitHub · нояб. 2025 — настоящее время",
  "GitHub · сент. 2025 — настоящее время",
  "GitHub · версия 1.1.0 опубликована · февр. 2026 — настоящее время",
  "GitHub · версия 3.5.2 опубликована · themodus.netlify.app · дек. 2024 — настоящее время",
  "GitHub · февр. 2026 — март 2026",
];

export default function RussianResumePage() {
  const projects = RESUME_BLOCKS.filter((block) => block.kind === "project");
  return <>
    <RuPageTitle eyebrow="Краткая биография · контакты">{ruResume.name}</RuPageTitle>
    <p>{ruResume.phone} · <a href={`mailto:${ruResume.email}`}>{ruResume.email}</a> · <a href={ruResume.linkedin}>LinkedIn</a> · <a href={ruResume.github}>GitHub</a></p>
    <p className="ru-notice">{ruResume.sourceNote}</p>
    <section className="ru-section"><h2>{ruResume.education}</h2><p>{ruResume.educationBody}</p></section>
    <section className="ru-section"><h2>{ruResume.projects}</h2>
      {projects.map((project, index) => <article className="ru-record" key={project.name}>
        <div><h3>{projectNames[index]}</h3><p className="ru-meta">{projectMeta[index]}</p><p className="ru-tags">{projectTech[index]}</p></div>
        <div><ul className="ru-list">{ruResume.projectBullets[index]?.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div>
      </article>)}
    </section>
    <section className="ru-section"><h2>{ruResume.hackathons}</h2>
      {ruResume.events.map(([title, date, body]) => <article className="ru-record" key={title}><p className="ru-date">{date}</p><div><h3>{title}</h3><p>{body}</p></div></article>)}
    </section>
    <section className="ru-section"><h2>{ruResume.certifications}</h2><p>{ruResume.certification}</p></section>
    <section className="ru-section"><h2>{ruResume.skills}</h2>
      <dl>{ruResume.skillGroups.map(([group, values]) => <div className="ru-record" key={group}><dt><strong>{group}</strong></dt><dd>{values}</dd></div>)}</dl>
    </section>
  </>;
}
