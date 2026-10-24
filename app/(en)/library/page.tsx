import type { Metadata } from "next";
import Link from "next/link";
import { shelves } from "@/lib/shelves";

export const metadata: Metadata = { title: "Library", description: "Books, films, and people in the personal library.", alternates: { canonical: "/library", languages: { en: "/library", ru: "/ru/library" } } };
export default function LibraryPage() {
  return <section className="section-block"><div className="content-shell"><p className="section-label">A few open shelves</p><h1 className="font-display text-5xl mb-10">Beyond the workbench.</h1><div className="notes-index">{shelves.map(shelf => <Link prefetch={false} href={`/library/${shelf.slug}`} key={shelf.slug}><div><h2 className="font-display text-3xl">{shelf.title}</h2><p className="text-muted-foreground mt-3">{shelf.description}</p></div><span aria-hidden>↗</span></Link>)}</div><p className="text-sm text-muted-foreground mt-8">These shelves grow with published notes. Empty shelves contain no invented reviews or ratings.</p></div></section>;
}
