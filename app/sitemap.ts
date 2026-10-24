import type { MetadataRoute } from "next";
import { projects, posts } from "@/lib/data";
import { concepts } from "@/lib/concepts";
import { shelves } from "@/lib/shelves";
import { notes } from "@/lib/notes";

export const dynamic = "force-static";
const base = "https://aryans.is-a.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/writing", "/resume", "/garden", "/notes", "/library", "/privacy", ...projects.map(project => `/projects/${project.slug}`), ...posts.map(post => `/writing/${post.slug}`), ...concepts.map(concept => `/garden/${concept.id}`), ...shelves.map(shelf => `/library/${shelf.slug}`)];
  return [
    ...paths.flatMap(path => ["en", "ru"].map(locale => ({ url: `${base}${locale === "ru" ? "/ru" : ""}${path}`, alternates: { languages: { en: `${base}${path}`, ru: `${base}/ru${path}` } } }))),
    { url: `${base}/search` },
    { url: `${base}/ru/projects` },
    ...notes.map(note => ({ url: `${base}${note.language === "ru" ? "/ru" : ""}/notes/${note.slug}`, lastModified: note.date })),
  ];
}
