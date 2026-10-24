import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { concepts, gardenItems, itemRelations } from "@/lib/garden";

const GardenGraph = dynamic(() => import("@/components/garden/GardenGraph"), { loading: () => <p>Opening the map…</p> });
export const metadata: Metadata = { title: "Garden", description: "A map of topics across existing writing and projects.", alternates: { canonical: "/garden", languages: { en: "/garden", ru: "/ru/garden" } } };

export default function GardenPage() {
  const relations: Record<string, string[]> = Object.fromEntries(gardenItems.map((item) => [item.id, itemRelations(item.id).map((related) => related.id)]));
  return <section className="section-block"><div className="content-shell">
    <header className="mb-8 grid gap-5 border-b border-border pb-7 lg:grid-cols-[0.8fr_1fr] lg:items-end">
      <div><p className="section-label">index / garden</p><h1 className="max-w-[10ch] font-serif text-[clamp(2.4rem,6vw,4.7rem)] leading-[0.9]">Ideas in the work.</h1></div>
      <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground">A navigable map of topics found in the current writing and project notes. Every connection points back to its source.</p>
    </header>
    <GardenGraph items={gardenItems} relations={relations} />
    <p className="mt-8 text-sm"><Link prefetch={false} href="/library" className="site-link">Browse the library: books, films, and people ↗</Link></p>
    <section className="mt-12 border-t border-border pt-6" aria-labelledby="concept-index">
      <p className="section-label">concept index</p><h2 id="concept-index" className="mb-4 font-serif text-2xl">Browse by topic</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{concepts.map((concept) => <li key={concept.id}><Link prefetch={false} className="block border border-border bg-card p-4 hover:border-accent" href={`/garden/${concept.id}`}><span className="font-serif text-xl">{concept.title}</span><span className="mt-1 block text-sm text-muted-foreground">Sources and backlinks →</span></Link></li>)}</ul>
    </section>
  </div></section>;
}
