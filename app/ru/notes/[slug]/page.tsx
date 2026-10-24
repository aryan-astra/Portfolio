import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { notes } from "@/lib/notes";
import NoteBody from "@/components/garden/NoteBody";
import { RuPageTitle } from "@/components/ru/RuShell";

export const dynamicParams = false;
export function generateStaticParams() {
  // shortcut: static export requires a nonempty param list; the sentinel renders 404 until a note is published.
  const params = notes.filter(note => note.language === "ru").map(({ slug }) => ({ slug }));
  return params.length ? params : [{ slug: "__unpublished" }];
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find(item => item.language === "ru" && item.slug === slug);
  return note ? { title: note.title, description: note.excerpt, alternates: { canonical: `https://aryans.is-a.dev/ru/notes/${slug}`, languages: { ru: `https://aryans.is-a.dev/ru/notes/${slug}`, ...(notes.some(item => item.language === "en" && item.slug === slug) ? { en: `https://aryans.is-a.dev/notes/${slug}` } : {}) } } } : {};
}
export default async function RussianNote({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = notes.find(item => item.language === "ru" && item.slug === slug);
  if (!note) notFound();
  return <article><Link href="/ru/notes">← Заметки</Link><RuPageTitle eyebrow={note.date}>{note.title}</RuPageTitle><p>{note.excerpt}</p><NoteBody blocks={note.blocks} locale="ru" /></article>;
}
