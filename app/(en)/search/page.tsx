import type { Metadata } from "next";
import SearchIndex from "@/components/garden/SearchIndex";
import { concepts } from "@/lib/garden";
import { posts, projects } from "@/lib/data";
import { notes, noteText } from "@/lib/notes";

export const metadata: Metadata = { title: "Search", description: "Search writing, projects, and topics.", alternates: { canonical: "/search" } };

export default function SearchPage() {
  const index = [
    ...notes.filter(item => item.language === "en").map(item => ({ id: `note:${item.id}`, title: item.title, excerpt: item.excerpt, type: "Writing", href: `/notes/${item.slug}`, terms: `${item.tags.join(" ")} ${noteText(item)}` })),
    ...projects.map((item) => ({ id: `project:${item.slug}`, title: item.name, excerpt: `${item.oneLiner} ${item.description}`, type: "Project", href: `/projects/${item.slug}`, terms: item.tags.join(" ") })),
    ...posts.map((item) => ({ id: `post:${item.slug}`, title: item.title, excerpt: item.description, type: "Writing", href: `/writing/${item.slug}`, terms: item.body.join(" ") })),
    ...concepts.map((item) => ({ id: `concept:${item.id}`, title: item.title, excerpt: "Topic index with linked writing and project sources.", type: "Concept", href: `/garden/${item.id}`, terms: item.aliases.join(" ") })),
  ];
  return <section className="section-block"><div className="content-shell"><header className="mb-8 border-b border-border pb-7"><p className="section-label">local index</p><h1 className="font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[0.9]">Search the site.</h1><p className="mt-4 max-w-[55ch] text-sm text-muted-foreground">Projects, writing, and topic pages. Search runs in this page using a small index built from published content.</p></header><SearchIndex entries={index} /></div></section>;
}
