import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { conceptSources, concepts } from "@/lib/garden";
import { ruConcepts } from "@/lib/ru-garden";
import { ruProjects, ruPosts } from "@/lib/ru";
import { notes } from "@/lib/notes";
import { RuPageTitle } from "@/components/ru/RuShell";

export function generateStaticParams() { return concepts.map(({ id }) => ({ slug: id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: ruConcepts[slug], alternates: { canonical: `https://aryans.is-a.dev/ru/garden/${slug}`, languages: { en: `https://aryans.is-a.dev/garden/${slug}`, ru: `https://aryans.is-a.dev/ru/garden/${slug}` } } };
}
export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = conceptSources(slug);
  if (!entry) notFound();
  const sources = entry.sources.flatMap(source => {
    const sourceSlug = source.href.split("/").at(-1)!;
    if (source.id.startsWith("note:")) {
      const translated = notes.find(note => note.language === "ru" && note.slug === sourceSlug);
      return translated ? [{ href: `/ru/notes/${sourceSlug}`, title: translated.title }] : [];
    }
    return [{ href: `/ru${source.href}`, title: source.type === "project" ? ruProjects[sourceSlug].name : ruPosts[sourceSlug].title }];
  });
  return <><Link href="/ru/garden">← Сад идей</Link><RuPageTitle eyebrow="Тема и источники">{ruConcepts[slug]}</RuPageTitle><p>Проекты и тексты, в которых встречается эта тема:</p>{sources.length ? <ul>{sources.map(source => <li key={source.href}><Link href={source.href}>{source.title}</Link></li>)}</ul> : <p>Связанных источников пока нет.</p>}</>;
}
