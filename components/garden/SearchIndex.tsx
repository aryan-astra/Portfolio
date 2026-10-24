"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Entry = { id: string; title: string; excerpt: string; type: string; href: string; terms: string };

export default function SearchIndex({ entries }: { entries: Entry[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const results = useMemo(() => {
    const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return entries.filter((entry) => (type === "All" || entry.type === type) && terms.every((term) => `${entry.title} ${entry.excerpt} ${entry.terms}`.toLocaleLowerCase().includes(term)));
  }, [entries, query, type]);
  return <>
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <label className="grid gap-1 text-sm"><span className="mono-label text-muted-foreground">Search terms</span><input autoComplete="off" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ‘local AI’ or ‘Arch’" className="min-h-12 border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-accent" /></label>
      <label className="grid gap-1 text-sm"><span className="mono-label text-muted-foreground">Content type</span><select value={type} onChange={(event) => setType(event.target.value)} className="min-h-12 border border-border bg-card px-4 text-foreground focus-visible:outline-2 focus-visible:outline-accent"><option>All</option><option>Project</option><option>Writing</option><option>Concept</option></select></label>
    </div>
    <p className="mono-label mb-2 mt-6 text-muted-foreground" aria-live="polite">{results.length} result{results.length === 1 ? "" : "s"}</p>
    <ul className="divide-y divide-border border-y border-border">{results.map((entry) => <li key={entry.id} className="py-5"><Link prefetch={false} href={entry.href} className="group"><span className="mono-label text-accent">{entry.type}</span><span className="mt-1 block font-serif text-2xl group-hover:text-accent">{entry.title}</span><span className="mt-2 block max-w-[75ch] text-sm leading-relaxed text-muted-foreground">{entry.excerpt}</span></Link></li>)}</ul>
    {results.length === 0 && <p className="py-8 text-sm text-muted-foreground">No matching items. Try a project name, article title, or topic.</p>}
    <noscript><p className="mt-6 text-sm text-muted-foreground">Enable JavaScript to filter the site index.</p><ul>{entries.map((entry) => <li key={entry.id}><Link prefetch={false} href={entry.href}>{entry.title}</Link></li>)}</ul></noscript>
  </>;
}
