import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { conceptSources, concepts } from "@/lib/garden";
import LinkedText from "@/components/garden/LinkedText";

export function generateStaticParams() { return concepts.map(({ id }) => ({ slug: id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = conceptSources(slug);
  return entry ? { title: entry.concept.title, description: `Sources connected to ${entry.concept.title}.`, alternates: { canonical: `/garden/${slug}`, languages: { en: `/garden/${slug}`, ru: `/ru/garden/${slug}` } } } : { title: "Topic not found" };
}

export default async function GardenConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = conceptSources(slug);
  if (!entry) notFound();
  return <section className="section-block"><div className="content-shell max-w-4xl">
    <Link prefetch={false} href="/garden" className="site-link mono-label">← Back to the garden</Link>
    <header className="my-7 border-y border-border py-7"><p className="section-label">topic / source index</p><h1 className="font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[0.9]">{entry.concept.title}</h1><p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">This page collects existing writing and projects where the topic appears. The linked sources provide the context.</p></header>
    <h2 className="font-serif text-2xl">Sources <span className="font-mono text-sm text-muted-foreground">({entry.sources.length})</span></h2>
    <ul className="mt-4 divide-y divide-border border-y border-border">{entry.sources.map((source) => <li key={source.id} className="py-5"><span className="mono-label text-accent">{source.type}</span><Link prefetch={false} href={source.href} className="group block"><span className="mt-1 block font-serif text-2xl group-hover:text-accent">{source.title}</span></Link><span className="mt-2 block max-w-[70ch] text-sm text-muted-foreground"><LinkedText text={source.excerpt} /></span></li>)}</ul>
    {entry.sources.length === 0 && <p className="mt-4 text-sm text-muted-foreground">No linked sources yet.</p>}
  </div></section>;
}
