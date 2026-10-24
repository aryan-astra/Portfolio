import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shelves } from "@/lib/shelves";
import { notes } from "@/lib/notes";
import { RuPageTitle } from "@/components/ru/RuShell";

export function generateStaticParams() { return shelves.map(({ slug }) => ({ shelf: slug })); }
export async function generateMetadata({ params }: { params: Promise<{ shelf: string }> }): Promise<Metadata> {
  const { shelf } = await params;
  const entry = shelves.find(item => item.slug === shelf);
  return entry ? { title: entry.ru, description: entry.ruDescription, alternates: { canonical: `https://aryans.is-a.dev/ru/library/${shelf}`, languages: { en: `https://aryans.is-a.dev/library/${shelf}`, ru: `https://aryans.is-a.dev/ru/library/${shelf}` } } } : {};
}
export default async function ShelfPage({ params }: { params: Promise<{ shelf: string }> }) {
  const { shelf } = await params;
  const entry = shelves.find(item => item.slug === shelf);
  if (!entry) notFound();
  const items = notes.filter(note => note.language === "ru" && note.kind === entry.kind);
  return <><Link href="/ru/library">← Библиотека</Link><RuPageTitle eyebrow="Полка">{entry.ru}</RuPageTitle><p>{entry.ruDescription}</p>{items.length ? <ul>{items.map(item => <li key={item.id}><Link href={`/ru/notes/${item.slug}`}>{item.title}</Link> — {item.excerpt}{item.rating !== undefined && <p>Оценка: {item.rating} из 4 орбит.</p>}</li>)}</ul> : <p>Опубликованных материалов пока нет. Можно <Link href="/ru/writing">прочитать существующие тексты</Link>.</p>}</>;
}
