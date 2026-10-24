import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data";
import { ruProjects } from "@/lib/ru";
import { RuPageTitle } from "@/components/ru/RuShell";

const base = "https://aryans.is-a.dev";
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = ruProjects[slug];
  return project ? {
    title: project.name,
    description: project.oneLiner,
    alternates: { canonical: `${base}/ru/projects/${slug}`, languages: { en: `${base}/projects/${slug}`, ru: `${base}/ru/projects/${slug}` } },
  } : { title: "Проект не найден" };
}

export default async function RussianProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  const text = ruProjects[slug];
  if (!project || !text) notFound();
  return <>
    <p className="ru-small"><Link href="/ru/projects">← Все проекты</Link> · {project.status}</p>
    <RuPageTitle eyebrow={`Разбор проекта · ${project.status}`}>{text.name}</RuPageTitle>
    <p className="ru-lede">{text.oneLiner}</p>
    {text.impact && <p><strong>Результат:</strong> {text.impact}</p>}
    <p>{text.description}</p>
    <p className="ru-tags">{project.caseStudy.stack.join(" · ")}</p>
    {slug === "arch-srm" && <figure style={{ margin: "1rem 0" }}><Image src="/images/arch.webp" alt="Панель Arch с посещаемостью, предметами в зоне риска и расписанием" width={1200} height={569} style={{ width: "100%", height: "auto" }} /><figcaption className="ru-small">Снимок экрана из репозитория. Личные данные скрыты в исходном изображении.</figcaption></figure>}
    <section className="ru-section"><h2>Задача</h2><p>{text.problem}</p></section>
    <section className="ru-section"><h2>Подход</h2><p>{text.approach}</p></section>
    <section className="ru-section"><h2>Ключевые решения</h2><ol className="ru-list">{text.keyDecisions.map((decision) => <li key={decision}>{decision}</li>)}</ol></section>
    <section className="ru-section"><h2>Результат</h2><p>{text.outcome}</p></section>
    <section className="ru-section"><h2>Ссылки</h2><p>{project.github && <><a href={project.github} target="_blank" rel="noreferrer">Исходный код</a> · </>}{project.live && <a href={project.live} target="_blank" rel="noreferrer">Открыть проект</a>}</p></section>
  </>;
}
