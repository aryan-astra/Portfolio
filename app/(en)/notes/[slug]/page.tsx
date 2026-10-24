import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { notes } from "@/lib/notes";
import { itemRelations } from "@/lib/garden";
import NoteBody from "@/components/garden/NoteBody";
import { DynamicIslandTOC } from "@/components/DynamicIslandTOC";

export const dynamicParams = false;
export function generateStaticParams() {
  // shortcut: static export requires a nonempty param list; the sentinel renders 404 until a note is published.
  const params = notes.filter(note => note.language === "en").map(({ slug }) => ({ slug }));
  return params.length ? params : [{ slug: "__unpublished" }];
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find(item => item.language === "en" && item.slug === slug);
  return note ? { title: note.title, description: note.excerpt, alternates: { canonical: `/notes/${slug}`, languages: { en: `/notes/${slug}`, ...(notes.some(item => item.language === "ru" && item.slug === slug) ? { ru: `/ru/notes/${slug}` } : {}) } } } : {};
}
export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = notes.find(item => item.language === "en" && item.slug === slug);
  if (!note) notFound();
  const related = itemRelations(`note:${note.id}`);
  return <DynamicIslandTOC><article className="section-block"><div className="content-shell article-copy"><Link prefetch={false} href="/notes" className="site-link">← Notebook</Link><header className="py-8 border-b border-border mb-8"><p className="section-label"><time dateTime={note.date}>{note.date}</time> / Published note</p><h1 className="font-display text-5xl">{note.title}</h1><p className="mt-6 text-muted-foreground">{note.excerpt}</p></header><NoteBody blocks={note.blocks} />{related.length > 0 && <aside className="mt-12 border-t border-border pt-6"><h2 className="font-display text-2xl">Connected ideas</h2><ul>{related.map(item => <li key={item.id}><Link prefetch={false} className="site-link" href={item.href}>{item.title}</Link></li>)}</ul></aside>}</div></article></DynamicIslandTOC>;
}
