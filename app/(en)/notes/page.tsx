import type { Metadata } from "next";
import Link from "next/link";
import { notes } from "@/lib/notes";

export const metadata: Metadata = { title: "Notebook", description: "Published notes from the workbench.", alternates: { canonical: "/notes", languages: { en: "/notes", ru: "/ru/notes" } } };
export default function NotesPage() {
  const entries = notes.filter(note => note.language === "en");
  return <section className="section-block"><div className="content-shell"><p className="section-label">The growing shelf</p><h1 className="font-display text-5xl mb-8">The notebook.</h1>{entries.length ? <ul className="notes-index">{entries.map(note => <li key={note.id}><Link prefetch={false} href={`/notes/${note.slug}`} className="block py-6 border-t border-border"><h2 className="font-display text-3xl">{note.title}</h2><p>{note.excerpt}</p><time dateTime={note.date}>{note.date}</time></Link></li>)}</ul> : <p className="text-muted-foreground">No published notes on this shelf yet. In the meantime, <Link prefetch={false} href="/writing" className="site-link">read the existing writing</Link> or <Link prefetch={false} href="/garden" className="site-link">explore its connections</Link>.</p>}</div></section>;
}
