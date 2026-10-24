import type { Metadata } from "next";
import Link from "next/link";
import { ruProjectList } from "@/lib/ru";
import { RuPageTitle } from "@/components/ru/RuShell";

const base = "https://aryans.is-a.dev";
export const metadata: Metadata = {
  title: "Проекты",
  description: "Проекты Арьяна Шуклы: мобильные приложения, локальный ИИ, утилиты и инструменты.",
  alternates: { canonical: `${base}/ru/projects`, languages: { en: `${base}/#projects`, ru: `${base}/ru/projects` } },
};

export default function RussianProjectsPage() {
  return <>
    <RuPageTitle eyebrow="Указатель · проекты">Проекты</RuPageTitle>
    <p className="ru-lede">Рабочие инструменты и эксперименты — с описанием задачи, решений и результата.</p>
    {ruProjectList.map((project) => <article className="ru-record" key={project.slug}>
      <p className="ru-date">{project.status}{project.impact ? ` · ${project.impact}` : ""}</p>
      <div><h2><Link href={`/ru/projects/${project.slug}`}>{project.name}</Link></h2><p>{project.oneLiner}</p><p className="ru-small">{project.description}</p><p className="ru-tags">{project.tags.join(" · ")}</p></div>
    </article>)}
  </>;
}
