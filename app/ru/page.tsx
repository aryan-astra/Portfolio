import type { Metadata } from "next";
import Link from "next/link";
import { ruHome, ruHackathons, ruProjectList, ruWriting } from "@/lib/ru";
import { RuPageTitle } from "@/components/ru/RuShell";

const base = "https://aryans.is-a.dev";
export const metadata: Metadata = {
  title: "Главная",
  description: ruHome.description,
  alternates: { canonical: `${base}/ru`, languages: { en: base, ru: `${base}/ru` } },
};

export default function RussianHomePage() {
  return (
    <>
      <RuPageTitle eyebrow={ruHome.label}>{ruHome.title}</RuPageTitle>
      <p className="ru-lede">{ruHome.intro}</p>
      <p>{ruHome.description}</p>
      <p className="ru-notice">{ruHome.status}</p>
      <section className="ru-section" id="projects">
        <h2>{ruHome.projects}</h2>
        <p><Link href="/ru/projects">Все проекты →</Link></p>
        {ruProjectList.filter((project) => project.featured).map((project) => (
          <article className="ru-record" key={project.slug}>
            <p className="ru-date">{project.status}</p>
            <div><h3><Link href={`/ru/projects/${project.slug}`}>{project.name}</Link></h3><p>{project.oneLiner}</p><p className="ru-small">{project.description}</p></div>
          </article>
        ))}
      </section>
      <section className="ru-section" id="writing">
        <h2>{ruHome.writing}</h2>
        {ruWriting.map((post) => <article className="ru-record" key={post.slug}><time className="ru-date" dateTime={post.date}>{post.date}</time><div><h3><Link href={`/ru/writing/${post.slug}`}>{post.title}</Link></h3><p>{post.description}</p></div></article>)}
      </section>
      <section className="ru-section" id="hackathons">
        <h2>{ruHome.hackathons}</h2>
        {ruHackathons.map((event) => <article className="ru-record" key={event.event}><p className="ru-date">{event.year} · {event.result}</p><div><h3>{event.event}</h3><p>{event.description}</p></div></article>)}
      </section>
      <section className="ru-section" id="contact">
        <h2>{ruHome.contact}</h2>
        <p>{ruHome.contactIntro} <a href="mailto:aryanworks@hotmail.com">aryanworks@hotmail.com</a></p>
        <p><a href="https://github.com/aryan-astra">GitHub</a> · <a href="https://x.com/aryanxastra">X</a> · <a href="https://linkedin.com/in/aryanworks">LinkedIn</a></p>
        <p><Link href="/ru/resume">Перейти к резюме</Link></p>
      </section>
    </>
  );
}
