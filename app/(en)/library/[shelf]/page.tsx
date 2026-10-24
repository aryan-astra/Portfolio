import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shelves } from "@/lib/shelves";
import { notes } from "@/lib/notes";

export function generateStaticParams() { return shelves.map(({ slug }) => ({ shelf: slug })); }
export async function generateMetadata({ params }: { params: Promise<{ shelf: string }> }): Promise<Metadata> {
  const { shelf } = await params;
  const entry = shelves.find(item => item.slug === shelf);
  return entry ? { title: entry.title, description: entry.description, alternates: { canonical: `/library/${shelf}`, languages: { en: `/library/${shelf}`, ru: `/ru/library/${shelf}` } } } : {};
}
export default async function ShelfPage({ params }: { params: Promise<{ shelf: string }> }) {
  const { shelf } = await params;
  const entry = shelves.find(item => item.slug === shelf);
  if (!entry) notFound();
  const items = notes.filter(note => note.language === "en" && note.kind === entry.kind);
  return <section className="section-block"><div className="content-shell"><Link prefetch={false} href="/library" className="site-link">← The library</Link><h1 className="font-display text-5xl my-8">{entry.title}</h1><p className="text-muted-foreground mb-8">{entry.description}</p>{items.length ? <ul className="notes-index">{items.map(item => <li className="py-5 border-t border-border" key={item.id}><Link prefetch={false} className="font-display text-2xl" href={`/notes/${item.slug}`}>{item.title} ↗</Link><p>{item.excerpt}</p>{item.rating !== undefined && <p aria-label={`${item.rating} out of 4 orbits`} className="font-mono text-sm mt-3">{"●".repeat(item.rating)}{"○".repeat(4-item.rating)} / {item.rating} of 4 orbits</p>}</li>)}</ul> : <p>No {entry.title.toLowerCase()} have been published here yet. <Link prefetch={false} className="site-link" href="/writing">There is writing to explore in the meantime.</Link></p>}</div></section>;
}
